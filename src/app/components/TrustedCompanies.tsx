import React from 'react';
import Image from 'next/image';

interface Company {
  name: string;
  icon: string;
  isImage?: boolean;
}

interface TrustedCompaniesProps {}

const TrustedCompanies: React.FC<TrustedCompaniesProps> = React.memo((): React.JSX.Element => {
  const companies: Company[] = [
    { name: "", icon: "/especial-needs.svg", isImage: true },
    { name: "", icon: "/ana-hana.svg", isImage: true },
    { name: "", icon: "/brivano.png", isImage: true },
    { name: "", icon: "/deepflow logo.png", isImage: true },
    { name: "", icon: "/fast-rehabs.svg", isImage: true },
    { name: "", icon: "/disaster-shield.svg", isImage: true },
    { name: "", icon: "/field-Call.svg", isImage: true },
    { name: "", icon: "/BookYOLO.png", isImage: true },
    { name: "", icon: "/alive1.jpg", isImage: true }
  ];

  // Duplicate companies 4 times for seamless infinite scroll
  const duplicatedCompanies = [...companies, ...companies, ...companies, ...companies];

  return (
    <section className="bg-black py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-gray-400 text-lg font-medium">
            Trusted by Innovative Companies
          </h2>
        </div>

        {/* Sliding Carousel */}
        <div className="overflow-hidden relative w-full">
          <div className="flex animate-scroll gap-4 hover:[animation-play-state:paused]">
            {duplicatedCompanies.map((company, index) => (
              <div
                key={index}
                className={`group bg-black rounded-lg text-center hover:bg-gray-900 transition-all duration-300 hover:scale-105 h-[100px] w-[280px] flex-shrink-0 flex flex-col justify-center items-center border border-gray-700 ${
                  company.icon === "/brivano.png" ? "p-2" : "p-4"
                }`}
              >
                {!company.icon ? (
                  <div className="w-full h-full flex justify-center items-center">
                    {/* Empty square - ready for your logo */}
                  </div>
                ) : company.isImage ? (
                  <div className={`w-full h-full flex justify-center items-center relative ${
                    company.icon === "/alive1.jpg" ? "overflow-visible" : ""
                  }`}>
                    <Image
                      src={company.icon}
                      alt={`${company.name || 'Alive'} logo`}
                      width={200}
                      height={200}
                      unoptimized
                      className={`object-contain transition-all duration-300 hover:scale-110 ${
                        company.icon === "/brivano.png"
                          ? "max-w-[98%] max-h-[98%]"
                          : company.icon === "/deepflow logo.png"
                          ? "max-w-[95%] max-h-[95%]"
                          : company.icon === "/alive1.jpg"
                          ? "max-w-[90%] max-h-[90%] w-auto h-auto"
                          : "max-w-[80%] max-h-[80%]"
                      } ${
                        company.icon === "/especial-needs.svg" || company.icon === "/deepflow logo.png" || company.icon === "/ana-hana.svg" || company.icon === "/fast-rehabs.svg" || company.icon === "/disaster-shield.svg" || company.icon === "/field-Call.svg" || company.icon === "/vvatts-premier.svg" || company.icon === "/alive1.jpg"
                          ? "grayscale group-hover:grayscale-0" 
                          : ""
                      }`}
                      style={company.icon === "/alive1.jpg" ? { display: 'block' } : undefined}
                      onError={(e) => {
                        console.error('Image failed to load:', company.icon);
                      }}
                    />
                  </div>
                ) : (
                  <>
                    {/* Icon */}
                    <div className="text-gray-400 text-2xl mb-2 flex justify-center items-center">
                      {company.icon}
                    </div>
                    
                    {/* Company Name */}
                    <div className="text-gray-400 text-sm font-medium">
                      {company.name}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
});

TrustedCompanies.displayName = 'TrustedCompanies';

export default TrustedCompanies;
