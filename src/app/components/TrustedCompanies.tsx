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
    { name: "", icon: "/darkinc.svg", isImage: true },
    { name: "", icon: "/deepflow-llc.svg", isImage: true },
    { name: "", icon: "/fast-rehabs.svg", isImage: true },
    { name: "", icon: "/disaster-shield.svg", isImage: true },
    { name: "", icon: "/field-Call.svg", isImage: true },
    { name: "", icon: "/vvatts-premier.svg", isImage: true }
  ];

  return (
    <section className="bg-black py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-gray-400 text-lg font-medium">
            Trusted by Innovative Companies
          </h2>
        </div>

        {/* Company Logos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {companies.map((company, index) => (
            <div
              key={index}
              className="bg-black rounded-lg p-4 text-center hover:bg-gray-900 transition-all duration-300 hover:scale-105 h-[100px] w-full flex flex-col justify-center items-center border border-gray-700"
            >
              {company.isImage ? (
                <div className="w-full h-full flex justify-center items-center">
                  <Image
                    src={company.icon}
                    alt={`${company.name} logo`}
                    width={200}
                    height={200}
                     className={`max-w-[80%] max-h-[80%] object-contain transition-all duration-300 hover:scale-110 ${
                       company.icon === "/especial-needs.svg" || company.icon === "/ana-hana.svg" || company.icon === "/fast-rehabs.svg" || company.icon === "/disaster-shield.svg" || company.icon === "/field-Call.svg" || company.icon === "/vvatts-premier.svg"
                         ? "grayscale hover:grayscale-0" 
                         : ""
                     }`}
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
    </section>
  );
});

TrustedCompanies.displayName = 'TrustedCompanies';

export default TrustedCompanies;
