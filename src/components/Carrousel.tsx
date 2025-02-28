import { motion } from "framer-motion";
import logo1 from "../assets/logo1.png";
import logo2 from "../assets/logo2.png";
import logo3 from "../assets/logo3.png";
import logo4 from "../assets/logo4.png";
import logo5 from "../assets/logo5.png";
import logo6 from "../assets/logo6.png";
import logo7 from "../assets/logo7.png";
// Array con 10 imágenes diferentes (duplicamos para efecto continuo)
const brands = [
  { logo: logo1 },
  { logo: logo2 },
  { logo: logo3 },
  { logo: logo4 },
  { logo: logo5 },
  { logo: logo6 },
  { logo: logo7 },
  { logo: logo1 },
  { logo: logo2 },
  { logo: logo3 },
  { logo: logo4 },
  { logo: logo5 },
  { logo: logo6 },
  { logo: logo7 }
];

export default function InfiniteCarousel() {
  return (
    <div className="bg-gray-200 mb-14 overflow-hidden py-8 relative">
      <motion.div
        className="flex gap-12 min-w-max"
        animate={{ x: ["0%", "-50%"] }} // Desplazamiento infinito
        transition={{
          ease: "linear",
          duration: 50, // Velocidad del desplazamiento (ajustable)
          repeat: Infinity, // Animación sin fin
        }}
      >
        {/* Duplicamos la lista para efecto de bucle */}
        {[...brands, ...brands].map((brand, i) => (
          <img
            key={i}
            src={brand.logo}
            alt={`Brand ${i}`}
            className="w-24 h-24 md:w-32 md:h-32 object-contain"
          />
        ))}
      </motion.div>
    </div>
  );
}