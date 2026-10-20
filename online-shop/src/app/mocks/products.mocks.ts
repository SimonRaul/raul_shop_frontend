import { Decimal } from "decimal.js";
import { Product } from "../types/products.types";

export const mockProducts: Product[] = [
  {
    name: "Laptop UltraBook Pro",
    description: "Laptop subțire și ușor cu procesor de ultimă generație, 16GB RAM și ecran 4K.",
    price: new Decimal("5499.99"),
    weight: 1.25,
    category: "Electronice",
    categoryDescription: "Dispozitive electronice, calculatoare și accesorii.",
    imageUrl: "https://example.com/images/laptop.jpg"
  },
  {
    name: "Căști Wireless Noise-Cancelling",
    description: "Căști over-ear cu anulare activă a zgomotului (ANC) și autonomie de 30 de ore.",
    price: new Decimal("1299.50"),
    weight: 0.25,
    category: "Audio",
    categoryDescription: "Echipamente audio, căști, boxe și accesorii conexe.",
    imageUrl: "https://example.com/images/casti-audio.jpg"
  },
  {
    name: "Cafea Boabe Espresso Arabica",
    description: "Amestec premium de cafea Arabica prăjită intens, ideală pentru un espresso autentic.",
    price: new Decimal("85.00"),
    weight: 1.0, // 1 kg
    category: "Băcănie",
    categoryDescription: "Produse alimentare neperisabile de uz curent.",
    imageUrl: "https://example.com/images/cafea-boabe.jpg"
  },
  {
    name: "Scaun Ergonomic de Birou",
    description: "Scaun de birou cu suport lombar ajustabil, tetieră și spătar din plasă respirabilă.",
    price: new Decimal("850.75"),
    weight: 15.5,
    category: "Mobilier",
    categoryDescription: "Mobilier pentru casă și birou, scaune și birouri.",
    imageUrl: "https://example.com/images/scaun-birou.jpg"
  },
  {
    name: "Tastatură Mecanică RGB",
    description: "Tastatură mecanică pentru gaming cu switch-uri roșii silențioase și iluminare personalizabilă.",
    price: new Decimal("450.00"),
    weight: 0.85,
    category: "Periferice PC",
    categoryDescription: "Tastaturi, mauși și alte componente periferice pentru calculatoare.",
    imageUrl: "https://example.com/images/tastatura-mecanica.jpg"
  }
];
