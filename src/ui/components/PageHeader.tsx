interface PageHeaderProps {
  title: string;
  description?: string;
}

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <header className="flex flex-col gap-1">
      <h1 className="font-semibold text-2xl tracking-tight">{title}</h1>
      {description && <p className="text-muted-foreground">{description}</p>}
    </header>
  );
}
