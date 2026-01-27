import type { Metadata } from "next";
import CareerDetails from "./CareerDetails";
import { careers } from "@/lib/careers";

export const metadata: Metadata = {
  title: "Career | Sukan Marketing",
  description: "Career with Sukan Marketing",
};



export function generateStaticParams() {
  return careers.map((p) => ({ slug: p.slug }));
}

export default function CareerDetailPage() {
  return <CareerDetails />;
}
