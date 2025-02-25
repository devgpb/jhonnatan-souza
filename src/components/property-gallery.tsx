"use client";

import { useState } from "react";
import Image from "next/image";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface PropertyGalleryProps {
  images: string[];
}

export function PropertyGallery({ images }: PropertyGalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const previousImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <>
      <div className="relative h-[50vh] sm:h-[75vh] bg-black">
        <div className="grid grid-cols-1 sm:grid-cols-[2fr_1fr] h-full gap-1">
          <div className="relative cursor-pointer" onClick={() => setIsOpen(true)}>
            <Image
              src={images[0] || "/placeholder.svg"}
              alt="Imagem principal"
              fill
              className="object-cover hover:opacity-95 transition-opacity"
              priority
            />
          </div>
          <div className="hidden sm:grid grid-rows-2 gap-1">
            {images.slice(1, 3).map((image, index) => (
              <div key={index} className="relative cursor-pointer" onClick={() => setIsOpen(true)}>
                <Image
                  src={image || "/placeholder.svg"}
                  alt={`Imagem ${index + 2}`}
                  fill
                  className="object-cover hover:opacity-95 transition-opacity"
                />
              </div>
            ))}
          </div>
          <Button
            variant="ghost"
            className="absolute right-4 bottom-4 md:right-6 md:bottom-6 bg-black/50 text-white hover:bg-black/70 text-sm md:text-base"
            onClick={() => setIsOpen(true)}
          >
            Ver todas as fotos
          </Button>
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-7xl h-[80vh] md:h-[90vh] p-0 gap-0">
          <div className="relative h-full bg-black flex items-center">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-3 right-3 md:top-4 md:right-4 text-white hover:bg-white/10 z-50"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-6 w-6 md:h-8 md:w-8" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/10"
              onClick={previousImage}
            >
              <ChevronLeft className="h-6 w-6 md:h-8 md:w-8" />
            </Button>

            <div className="relative w-full h-full">
              <Image
                src={images[currentImageIndex] || "/placeholder.svg"}
                alt={`Imagem ${currentImageIndex + 1}`}
                fill
                className="object-contain"
              />
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/10"
              onClick={nextImage}
            >
              <ChevronRight className="h-6 w-6 md:h-8 md:w-8" />
            </Button>

            <div className="absolute bottom-3 md:bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1 md:px-4 md:py-2 bg-black/50 rounded-full">
              <span className="text-white text-xs md:text-sm">
                {currentImageIndex + 1} / {images.length}
              </span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
