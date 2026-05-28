"use client";

import InputField from "@/components/InputField";
import { LatLng } from "@/components/Map";
import { Check, Globe, MapPin, MapPinHouse, Navigation } from "lucide-react";
import Map from "@/components/Map";

interface Props {
  latLng: LatLng | undefined;
  setLatLng: React.Dispatch<React.SetStateAction<LatLng | undefined>>;
  errors: Record<string, string[]>;
  defaultValues?: {
    venue: string;
    address: string;
    city: string;
    country: string;
  };
}

export default function LocationPicker({
  latLng,
  setLatLng,
  errors,
  defaultValues,
}: Props) {
  return (
    <section className="w-full rounded-2xl border border-violet-100 bg-white/80 p-5 shadow-sm shadow-violet-100/60">
      <p className="text-xs font-bold tracking-[0.22em] text-violet-500 mb-3">
        ΤΟΠΟΘΕΣΙΑ
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <InputField
          label="Χώρος"
          name="venue"
          icon={MapPinHouse}
          defaultValue={defaultValues?.venue}
          placeholder="Μέγαρο Μουσικής"
          error={errors.venue?.[0]}
          id="venue"
        />
        <InputField
          label="Διεύθυνση"
          name="address"
          defaultValue={defaultValues?.address}
          icon={Navigation}
          error={errors.address?.[0]}
          placeholder="Βασιλίσσης Σοφίας 1"
          id="address"
        />
        <InputField
          label="Πόλη"
          name="city"
          defaultValue={defaultValues?.city}
          error={errors.city?.[0]}
          icon={MapPin}
          placeholder="Αθήνα"
          id="city"
        />
        <InputField
          label="Χώρα"
          name="country"
          icon={Globe}
          defaultValue={defaultValues?.country}
          error={errors.country?.[0]}
          placeholder="Ελλάδα"
          id="country"
        />
      </div>

      <div className="mt-6 rounded-3xl border border-violet-100 bg-violet-50/80 p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4 px-2">
          <div className="flex items-center gap-4 text-gray-600">
            <MapPin size={30} />
            <div>
              <p className="text-md font-bold leading-tight">
                Επιλέξτε σημείο στον χάρτη
              </p>
              <p className="text-sm text-gray-500 leading-tight">
                {latLng
                  ? "Κάντε κλικ στην πινέζα για να την αφαιρέσετε"
                  : "Κάντε κλικ στο χάρτη για να ορίσετε συντεταγμένες"}
              </p>
            </div>
          </div>
          {latLng ? (
            <div className="flex items-center ml-2 text-sm text-green-600 font-medium gap-2">
              Επιλέγχθηκε τοποθεσία
              <Check size={20} />
            </div>
          ) : (
            <span className="text-violet-700 tracking-wide font-semibold text-sm">
              Προαιρετικό
            </span>
          )}
        </div>
        {latLng && (
          <>
            <input type="hidden" name="latitude" value={latLng[0]} />
            <input type="hidden" name="longitude" value={latLng[1]} />
          </>
        )}
        <Map
          initialZoom={13}
          marker={latLng ?? undefined}
          onMarkerClick={() => setLatLng(undefined)}
          onClick={(latlng) => setLatLng(latlng)}
        />
      </div>
    </section>
  );
}
