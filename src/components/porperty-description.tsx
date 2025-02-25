interface PropertyDescriptionProps {
  property: {
    description: string;
  };
}

export function PropertyDescription({ property }: PropertyDescriptionProps) {
  return (
    <div className="space-y-3 md:space-y-4">
      <h2 className="text-base md:text-lg font-semibold">Descrição</h2>
      <div className="text-muted-foreground text-sm md:text-base whitespace-pre-line">
        {property.description}
      </div>
    </div>
  );
}