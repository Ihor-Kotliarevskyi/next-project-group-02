'use client';

import { Toaster } from 'react-hot-toast';
import css from '@/components/AuthComponent/AuthNav/Auth.module.css';

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className={css.wrapper}>
            <header className={css.header}>
                <div className={css.logo}>Relax</div>
            </header>

            <div className={css.content}>{children}</div>

            <footer className={css.footer}>
                <p>&copy; {new Date().getFullYear()} Relax Map</p>
            </footer>

            <Toaster position="top-right" />
        </div>
    );
}
