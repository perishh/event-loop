import Image from "next/image";
import { Mail, Phone } from "lucide-react";
import Logo from "../assets/logo.png";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto bg-violet-700 text-violet-200">
      <div className="mx-auto w-full max-w-6xl px-6 py-8">
        <div className="flex flex-col items-center text-center">
          <Image src={Logo} alt="Λογότυπο EventLoop" className="w-48" />

          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm">
            <span className="font-semibold text-white">Επικοινωνία:</span>
            <span className="flex items-center gap-2">
              <Mail className="h-4 w-4 shrink-0" />
              xxxx@xxxx.com
            </span>
            <span className="flex items-center gap-2">
              <Phone className="h-4 w-4 shrink-0" />
              +30 21X XXX XXXX
            </span>
          </div>
        </div>

        <div className="mt-4 border-t border-violet-600 pt-3 text-center">
          <p className="text-xs text-violet-300">
            © {year} EventLoop. Με επιφύλαξη παντός δικαιώματος.
          </p>
        </div>
      </div>
    </footer>
  );
}
