"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

interface PropertyContactProps {
  data: {
    property: {
      price: number;
      iptu: number;
      year: number;
    }
    broker: {
      name: string;
      company: string;
      creci: string;
      phone: string;
      email: string;
      avatar: string;
    };
  }
}

export function PropertyContact({ data }: PropertyContactProps) {
  return (
    <div className="space-y-4 md:space-y-6 md:sticky md:top-28">
      <Card>
        <CardContent className="p-4 md:p-6 bg-[#FAF9F6]">
          <div className="space-y-4 md:space-y-6">
            <div>
              <h3 className="text-xs md:text-sm text-muted-foreground mb-1">Valor do imóvel</h3>
              <p className="text-lg md:text-3xl font-semibold">{formatCurrency(data.property.price)}</p>
            </div>

            <div className="space-y-3 md:space-y-4">
              {/* <div className="flex justify-between text-xs md:text-sm">
                <span className="text-muted-foreground">Valor do condomínio</span>
                <span>R$ 1.000</span>
              </div> */}
              <div className="flex justify-between text-xs md:text-sm">
                <span className="text-muted-foreground">IPTU (mensal)</span>
                <span>{formatCurrency(data.property.iptu)}</span>
              </div>
              <div className="flex justify-between text-xs md:text-sm">
                <span className="text-muted-foreground">Ano de construção</span>
                <span>{data.property.year}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 md:gap-3 pt-3 md:pt-4">
              <Image
                src={data.broker.avatar || "/placeholder.svg"}
                alt={data.broker.name}
                width={48}
                height={48}
                className="w-12 md:w-16 h-12 md:h-16 rounded-full"
              />
              <div>
                <p className="font-medium text-sm md:text-base">{data.broker.name}</p>
                <p className="text-xs md:text-sm text-muted-foreground">{data.broker.company}</p>
              </div>
            </div>

            <Button className="w-full bg-black hover:bg-black/90 text-sm md:text-base h-10 md:h-12">
              Falar com {data.broker.name.split(" ")[0]}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
