import css from "@/components/AuthComponent/AuthNav/Auth.module.css";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className={css.content}>{children}</div>;
}
