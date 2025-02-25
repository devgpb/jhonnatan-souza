import { formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Bed, Bath, Car, Square, MapPin } from "lucide-react";

interface PropertyDetailsProps {
  property: {
    id: string;
    title: string;
    location: string;
    price: number;
    area: number;
    bedrooms: number;
    suites: number;
    bathrooms: number;
    parking: number;
    amenities: string[];
  };
}

export function PropertyDetails({ property }: PropertyDetailsProps) {
  return (
    <div className="space-y-4 md:space-y-6">
      {/* Informações principais */}
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline">Ref. {property.id}</Badge>
          <Badge>Venda</Badge>
        </div>
        <h1 className="text-2xl md:text-3xl font-semibold">{property.title}</h1>
        <p className="text-sm md:text-lg text-muted-foreground flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          {property.location}
        </p>
      </div>

      {/* Preço */}
      <div className="flex flex-wrap items-baseline gap-2">
        <span className="text-3xl md:text-4xl font-bold">{formatCurrency(property.price)}</span>
        <span className="text-muted-foreground text-sm md:text-base">
          {formatCurrency(property.price / property.area)}/m²
        </span>
      </div>

      {/* Informações sobre o imóvel */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6 py-4 md:py-6 border-y">
        <div className="flex flex-col items-center gap-1 md:gap-2">
          <Square className="h-5 w-5 md:h-6 md:w-6 text-muted-foreground" />
          <span className="text-sm md:text-lg font-semibold">{property.area}m²</span>
          <span className="text-xs md:text-sm text-muted-foreground">Área útil</span>
        </div>
        <div className="flex flex-col items-center gap-1 md:gap-2">
          <Bed className="h-5 w-5 md:h-6 md:w-6 text-muted-foreground" />
          <span className="text-sm md:text-lg font-semibold">{property.bedrooms}</span>
          <span className="text-xs md:text-sm text-muted-foreground">Quartos</span>
        </div>
        <div className="flex flex-col items-center gap-1 md:gap-2">
          <Bath className="h-5 w-5 md:h-6 md:w-6 text-muted-foreground" />
          <span className="text-sm md:text-lg font-semibold">{property.bathrooms}</span>
          <span className="text-xs md:text-sm text-muted-foreground">Banheiros</span>
        </div>
        <div className="flex flex-col items-center gap-1 md:gap-2">
          <Car className="h-5 w-5 md:h-6 md:w-6 text-muted-foreground" />
          <span className="text-sm md:text-lg font-semibold">{property.parking}</span>
          <span className="text-xs md:text-sm text-muted-foreground">Vagas</span>
        </div>
      </div>

      {/* Características */}
      <div>
        <h2 className="text-base md:text-lg font-semibold mb-3 md:mb-4">Características</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-2 text-xs md:text-sm text-muted-foreground">
          {property.amenities.map((amenity) => (
            <div key={amenity} className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-primary" />
              {amenity}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
