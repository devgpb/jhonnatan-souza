import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Bed, Car, Square } from "lucide-react";

interface PropertyCardProps {
  id: string;
  image: string;
  price: number;
  area: number;
  suites: number;
  parking: number;
  location: string;
  title: string;
  broker: {
    name: string;
    company: string;
    avatar: string;
  };
}

export function PropertyCard({ id, image, price, area, suites, parking, location, title, broker }: PropertyCardProps) {
  return (
    <Link href={`/imovel/${id}`}>
      <Card className="group overflow-hidden">
        <div className="relative">
          <div className="relative aspect-[3/2] md:aspect-[4/3]">
            <Image
              src={image || "/placeholder.svg"}
              alt={location}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            {/* Informações do corretor com efeito glass */}
            <div className="absolute bottom-0 left-0 right-0 bg-black/30 backdrop-blur-md p-2 md:p-3 flex items-center gap-2 md:gap-3">
              <Image
                src={broker.avatar || "/placeholder.svg"}
                alt={broker.name}
                width={35}
                height={35}
                className="rounded-full border-2 border-white/10"
              />
              <div>
                <p className="text-white text-xs md:text-sm font-medium">{broker.name}</p>
                <p className="text-gray-300 text-[10px] md:text-xs">{broker.company}</p>
              </div>
            </div>
          </div>
        </div>

        <CardContent className="p-3 md:p-4">
          <div className="space-y-1 md:space-y-2">
          <div>
            <h3 className="text-base md:text-lg font-medium line-clamp-2 group-hover:text-primary transition-colors">
              {title}
            </h3>
            <p className="text-lg md:text-2xl font-semibold mt-1">
              {price.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
                maximumFractionDigits: 0,
              })}
            </p>
          </div>
            <div className="flex flex-wrap gap-2 md:gap-4 text-xs md:text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Square className="h-4 w-4" />
                {area}m²
              </span>
              <span className="flex items-center gap-1">
                <Bed className="h-4 w-4" />
                {suites} {suites === 1 ? "suíte" : "suítes"}
              </span>
              <span className="flex items-center gap-1">
                <Car className="h-4 w-4" />
                {parking} {parking === 1 ? "vaga" : "vagas"}
              </span>
            </div>
            <p className="text-muted-foreground text-sm md:text-base">{location}</p>
            <p className="text-[10px] md:text-xs text-muted-foreground">{id}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
