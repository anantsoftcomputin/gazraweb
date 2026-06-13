import { useEffect, useRef, useState } from 'react';
import { CheckCircle2, QrCode, Search, StopCircle, UserCheck, XCircle } from 'lucide-react';
import { collection, getDocs, limit, query, Timestamp, updateDoc, where, doc } from 'firebase/firestore';
import AdminLayout from '../../layouts/AdminLayout';
import { db } from '../../config/firebase';

const scannerElementId = 'event-check-in-scanner';

const emptyResult = {
  type: '',
  message: '',
  rsvp: null
};

function extractToken(rawValue) {
  const value = rawValue.trim();
  if (!value) return '';

  try {
    const parsed = JSON.parse(value);
    if (parsed?.type === 'gazra-event-rsvp' && parsed.qrToken) return parsed.qrToken;
    if (parsed?.qrToken) return parsed.qrToken;
  } catch {
    // Plain token scans are supported too.
  }

  return value;
}

const AdminEventCheckIn = () => {
  const [manualCode, setManualCode] = useState('');
  const [scannerActive, setScannerActive] = useState(false);
  const [scannerError, setScannerError] = useState('');
  const [result, setResult] = useState(emptyResult);
  const [checking, setChecking] = useState(false);
  const scannerRef = useRef(null);
  const manualInputRef = useRef(null);
  const lastScanRef = useRef('');

  useEffect(() => {
    if (!scannerActive) return undefined;
    let mounted = true;

    const startScanner = async () => {
      try {
        const { Html5QrcodeScanner } = await import('html5-qrcode');
        if (!mounted) return;

        const scanner = new Html5QrcodeScanner(
          scannerElementId,
          {
            fps: 10,
            qrbox: { width: 260, height: 260 },
            rememberLastUsedCamera: true
          },
          false
        );

        scannerRef.current = scanner;
        scanner.render(
          (decodedText) => {
            if (decodedText === lastScanRef.current || checking) return;
            lastScanRef.current = decodedText;
            checkInByCode(decodedText);
          },
          () => {}
        );
      } catch (error) {
        setScannerError(error.message || 'Unable to start QR scanner.');
      }
    };

    startScanner();

    return () => {
      mounted = false;
      if (scannerRef.current) {
        scannerRef.current.clear().catch(() => {});
        scannerRef.current = null;
      }
    };
  }, [scannerActive]); // eslint-disable-line react-hooks/exhaustive-deps

  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const getRsvpSnapshot = async (qrToken) => {
    const rsvpQuery = query(collection(db, 'eventRsvps'), where('qrToken', '==', qrToken), limit(1));
    let lastError = null;

    for (let attempt = 0; attempt < 5; attempt += 1) {
      try {
        return await getDocs(rsvpQuery);
      } catch (error) {
        lastError = error;
        if (error.code !== 'unavailable') throw error;
        await wait(600);
      }
    }

    throw lastError;
  };

  const checkInByCode = async (rawCode = manualInputRef.current?.value || manualCode) => {
    const qrToken = extractToken(rawCode);
    if (!qrToken) {
      setResult({ type: 'error', message: 'Enter or scan a valid RSVP QR code.', rsvp: null });
      return;
    }

    setChecking(true);
    setScannerError('');
    try {
      const snapshot = await getRsvpSnapshot(qrToken);

      if (snapshot.empty) {
        setResult({ type: 'error', message: 'No RSVP found for this QR code.', rsvp: null });
        return;
      }

      const rsvpDoc = snapshot.docs[0];
      const rsvp = { id: rsvpDoc.id, ...rsvpDoc.data() };

      if (rsvp.checkedIn) {
        setResult({
          type: 'warning',
          message: `${rsvp.name || 'This guest'} was already checked in.`,
          rsvp
        });
        return;
      }

      await updateDoc(doc(db, 'eventRsvps', rsvpDoc.id), {
        checkedIn: true,
        attendanceStatus: 'checked_in',
        checkedInAt: Timestamp.now(),
        checkedInBy: 'admin-scanner',
        updatedAt: Timestamp.now()
      });

      setManualCode('');
      setResult({
        type: 'success',
        message: `${rsvp.name || 'Guest'} checked in successfully.`,
        rsvp: {
          ...rsvp,
          checkedIn: true,
          attendanceStatus: 'checked_in',
          checkedInAt: Timestamp.now()
        }
      });
    } catch (error) {
      setResult({ type: 'error', message: error.message || 'Unable to check in RSVP.', rsvp: null });
    } finally {
      setChecking(false);
    }
  };

  const stopScanner = () => {
    setScannerActive(false);
    lastScanRef.current = '';
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-neutral-800">Event Check-In</h1>
            <p className="mt-2 text-neutral-600">Scan guest RSVP QR codes or enter the QR token manually.</p>
          </div>
          <div className="flex gap-2">
            {!scannerActive ? (
              <button
                onClick={() => setScannerActive(true)}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary-500 px-4 py-2 text-white transition-colors hover:bg-primary-600"
              >
                <QrCode className="h-5 w-5" />
                Start Scanner
              </button>
            ) : (
              <button
                onClick={stopScanner}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-neutral-800 px-4 py-2 text-white transition-colors hover:bg-neutral-900"
              >
                <StopCircle className="h-5 w-5" />
                Stop Scanner
              </button>
            )}
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr),minmax(360px,0.9fr)]">
          <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-lg bg-primary-50 p-3 text-primary-600">
                <QrCode className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-neutral-900">QR Scanner</h2>
                <p className="text-sm text-neutral-600">Use a laptop or mobile camera at the venue entrance.</p>
              </div>
            </div>

            {scannerActive ? (
              <div className="overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50 p-3">
                <div id={scannerElementId} className="min-h-[320px]" />
              </div>
            ) : (
              <div className="flex min-h-[320px] flex-col items-center justify-center rounded-xl border border-dashed border-neutral-300 bg-neutral-50 text-center">
                <QrCode className="mb-3 h-12 w-12 text-neutral-300" />
                <p className="font-medium text-neutral-700">Scanner is off</p>
                <p className="mt-1 text-sm text-neutral-500">Start the scanner when you are ready to check guests in.</p>
              </div>
            )}

            {scannerError && (
              <div className="mt-4 rounded-lg border border-red-100 bg-red-50 p-3 text-sm text-red-700">
                {scannerError}
              </div>
            )}
          </section>

          <section className="space-y-6">
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-neutral-900">Manual Check-In</h2>
              <p className="mt-1 text-sm text-neutral-600">Paste the QR payload or token if camera scanning is unavailable.</p>
              <div className="mt-4 space-y-3">
                <textarea
                  ref={manualInputRef}
                  value={manualCode}
                  onChange={(event) => setManualCode(event.target.value)}
                  rows={5}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500"
                  placeholder='{"type":"gazra-event-rsvp","eventId":"...","rsvpId":"...","qrToken":"..."}'
                />
                <button
                  onClick={() => checkInByCode(manualInputRef.current?.value || manualCode)}
                  disabled={checking}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary-500 px-4 py-3 text-white transition-colors hover:bg-primary-600 disabled:opacity-50"
                >
                  <Search className="h-5 w-5" />
                  {checking ? 'Checking...' : 'Check In Guest'}
                </button>
              </div>
            </div>

            {result.message && (
              <div className={`rounded-xl border p-6 shadow-sm ${
                result.type === 'success'
                  ? 'border-green-200 bg-green-50'
                  : result.type === 'warning'
                    ? 'border-yellow-200 bg-yellow-50'
                    : 'border-red-200 bg-red-50'
              }`}>
                <div className="flex items-start gap-3">
                  {result.type === 'success' ? (
                    <CheckCircle2 className="mt-1 h-6 w-6 text-green-700" />
                  ) : result.type === 'warning' ? (
                    <UserCheck className="mt-1 h-6 w-6 text-yellow-700" />
                  ) : (
                    <XCircle className="mt-1 h-6 w-6 text-red-700" />
                  )}
                  <div>
                    <h3 className="font-semibold text-neutral-900">{result.message}</h3>
                    {result.rsvp && (
                      <div className="mt-3 space-y-1 text-sm text-neutral-700">
                        <p><span className="font-medium">Event:</span> {result.rsvp.eventTitle || result.rsvp.eventId}</p>
                        <p><span className="font-medium">Name:</span> {result.rsvp.name}</p>
                        <p><span className="font-medium">Email:</span> {result.rsvp.email}</p>
                        <p><span className="font-medium">Phone:</span> {result.rsvp.phone}</p>
                        <p><span className="font-medium">Ticket:</span> {result.rsvp.rsvpId || result.rsvp.id}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminEventCheckIn;
