import { useEffect, useRef } from 'react';

interface MapPoint {
  x: number;
  y: number;
  value: number;
  sold: boolean;
}

interface PropertyMapData {
  points: MapPoint[];
}

interface PropertyMapProps {
  data: PropertyMapData;
}

export default function PropertyMap({ data }: PropertyMapProps) {
  const mapRef = useRef<HTMLCanvasElement | null>(null);
  
  useEffect(() => {
    if (!data || !mapRef.current) return;
    
    // This is a placeholder for a real map implementation
    // You would typically use a library like Leaflet, Google Maps, or Mapbox here
    const ctx = mapRef.current.getContext('2d');
    if (!ctx) return;
    
    // Clear the canvas
    ctx.clearRect(0, 0, mapRef.current.width, mapRef.current.height);
    
    // Draw a simple placeholder map
    ctx.fillStyle = '#f3f4f6';
    ctx.fillRect(0, 0, mapRef.current.width, mapRef.current.height);
    
    // Draw grid lines
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    
    // Vertical lines
    for (let x = 0; x < mapRef.current.width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, mapRef.current.height);
      ctx.stroke();
    }
    
    // Horizontal lines
    for (let y = 0; y < mapRef.current.height; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(mapRef.current.width, y);
      ctx.stroke();
    }
    
    // Draw data points
    data.points.forEach(point => {
      if (!mapRef.current) return;
      const x = (point.x / 100) * mapRef.current.width;
      const y = (point.y / 100) * mapRef.current.height;
      const radius = point.value / 2 + 5; // Scale the radius based on value
      
      // Draw circle
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, 2 * Math.PI);
      ctx.fillStyle = point.sold ? 'rgba(239, 68, 68, 0.7)' : 'rgba(59, 130, 246, 0.7)';
      ctx.fill();
      
      // Draw border
      ctx.strokeStyle = point.sold ? 'rgb(239, 68, 68)' : 'rgb(59, 130, 246)';
      ctx.lineWidth = 1;
      ctx.stroke();
    });
    
    // Add a legend
    ctx.fillStyle = '#1f2937';
    ctx.font = '12px Arial';
    ctx.fillText('● Vendidos', 10, 20);
    ctx.fillText('● Disponíveis', 10, 40);
    
  }, [data]);

  if (!data) return <div className="h-64 flex items-center justify-center">Sem dados disponíveis</div>;

  return (
    <div className="h-64 relative">
      <canvas 
        ref={mapRef} 
        width={500} 
        height={250} 
        className="w-full h-full"
      ></canvas>
      <div className="absolute bottom-2 right-2 text-xs text-gray-500">
        * Mapa ilustrativo. Integre com uma API de mapas real.
      </div>
    </div>
  );
}
