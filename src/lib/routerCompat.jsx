'use client';

import NextLink from 'next/link';
import { usePathname, useParams as useNextParams, useRouter } from 'next/navigation';

export function Link({ to, href, children, ...props }) {
  const target = href || to || '#';

  return (
    <NextLink href={target} {...props}>
      {children}
    </NextLink>
  );
}

export function useLocation() {
  const pathname = usePathname();
  return { pathname };
}

export function useNavigate() {
  const router = useRouter();

  return (target) => {
    if (typeof target === 'number') {
      if (target < 0) router.back();
      return;
    }

    router.push(target);
  };
}

export function useParams() {
  return useNextParams();
}
