import React, { useMemo } from 'react';

interface Company {
  name: string;
  icon: string;
  isImage?: boolean;
}

interface TrustedCompaniesProps {}

// Move companies array outside component for Fast Refresh compatibility
const COMPANIES: Company[] = [
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

const TrustedCompanies: React.FC<TrustedCompaniesProps> = React.memo((): React.JSX.Element => {
  // Create multiple sets for seamless infinite scroll - ensure all logos including alive1 are visible
  // We need at least 2 full sets for seamless loop, using 3 sets to ensure alive1 is always visible
  const allLogos = useMemo(() => [...COMPANIES, ...COMPANIES, ...COMPANIES], []);

  // Get logo sizing
  const getLogoSize = (icon: string) => {
    if (icon === "/brivano.png") return { maxW: "98%", maxH: "98%" };
    if (icon === "/deepflow logo.png") return { maxW: "95%", maxH: "95%" };
    if (icon === "/alive1.jpg") return { maxW: "90%", maxH: "90%" };
    return { maxW: "85%", maxH: "85%" };
  };

  // Get padding
  const getPadding = (icon: string) => {
    if (icon === "/brivano.png") return "p-3";
    if (icon === "/alive1.jpg") return "p-5";
    return "p-6";
  };

  return (
    <section className="bg-black py-20 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-500/10 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-blue-500/10 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-gray-200 text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-clip-text text-transparent">
            Trusted by Innovative Companies
          </h2>
          <div className="w-32 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent mx-auto rounded-full"></div>
        </div>

        {/* New Carousel Design - Dual Track Approach */}
        <div className="relative">
          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-40 bg-gradient-to-r from-black via-black/80 to-transparent z-20 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-40 bg-gradient-to-l from-black via-black/80 to-transparent z-20 pointer-events-none"></div>

          {/* Carousel Container */}
          <div className="overflow-hidden">
            <div className="flex animate-scroll gap-8" style={{ width: 'max-content' }}>
              {allLogos.map((company, index) => {
                const size = getLogoSize(company.icon);
                const isAlive1 = company.icon === "/alive1.jpg";
                return (
                  <div
                    key={`logo-${company.icon}-${index}`}
                    className="group flex-shrink-0"
                    style={{ 
                      width: '300px',
                      minWidth: '300px',
                      flexShrink: 0
                    }}
                  >
                    {/* Card with modern design */}
                    <div className={`relative h-[130px] w-full rounded-xl bg-gradient-to-br from-gray-800/40 via-gray-900/60 to-gray-800/40 backdrop-blur-md border border-gray-700/30 flex items-center justify-center transition-all duration-700 hover:border-purple-400/60 hover:shadow-[0_0_30px_rgba(168,85,247,0.3)] hover:scale-110 hover:bg-gradient-to-br hover:from-gray-700/50 hover:via-gray-800/70 hover:to-gray-700/50 ${getPadding(company.icon)} ${isAlive1 ? 'ring-2 ring-yellow-500/30' : ''}`}
                      data-logo-type={isAlive1 ? 'alive1' : 'other'}
                      data-index={index}
                    >
                      {/* Animated border glow */}
                      <div className="absolute inset-0 rounded-xl border-2 border-transparent bg-gradient-to-r from-purple-500/0 via-purple-500/20 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10"></div>
                      
                      {/* Inner glow */}
                      <div className="absolute inset-[2px] rounded-lg bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                      
                      {/* Logo */}
                      <div className="relative z-10 w-full h-full flex items-center justify-center">
                        {company.isImage ? (
                          <>
                            <img
                              src={company.icon}
                              alt={isAlive1 ? "Alive logo" : "Company logo"}
                              className={`object-contain transition-all duration-700 grayscale group-hover:grayscale-0 group-hover:scale-125 ${isAlive1 ? 'alive-logo' : ''}`}
                              style={{
                                maxWidth: size.maxW,
                                maxHeight: size.maxH,
                                width: 'auto',
                                height: 'auto',
                                display: 'block',
                                visibility: 'visible',
                                opacity: 1,
                                position: 'relative',
                                zIndex: 10
                              }}
                              loading={isAlive1 ? "eager" : "lazy"}
                              onLoad={(e) => {
                                if (isAlive1) {
                                  console.log('✅ Alive1 logo loaded successfully at index:', index);
                                  const target = e.target as HTMLImageElement;
                                  target.style.opacity = '1';
                                  target.style.visibility = 'visible';
                                }
                              }}
                              onError={(e) => {
                                console.error('❌ Failed to load:', company.icon, 'at index:', index);
                                const target = e.target as HTMLImageElement;
                                target.style.opacity = '0.3';
                                if (isAlive1) {
                                  target.style.border = '2px dashed yellow';
                                  // Add fallback text
                                  const parent = target.parentElement;
                                  if (parent) {
                                    const existing = parent.querySelector('.alive-fallback');
                                    if (!existing) {
                                      const fallback = document.createElement('div');
                                      fallback.className = 'alive-fallback absolute text-white text-sm font-bold';
                                      fallback.textContent = 'ALIVE';
                                      fallback.style.zIndex = '20';
                                      parent.appendChild(fallback);
                                    }
                                  }
                                }
                              }}
                            />
                            {/* Debug indicator for alive1 */}
                            {isAlive1 && (
                              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full opacity-50" title="Alive1 logo"></div>
                            )}
                          </>
                        ) : (
                          <span className="text-gray-400 text-sm">{company.name}</span>
                        )}
                      </div>

                      {/* Shine effect */}
                      <div className="absolute inset-0 rounded-xl overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

TrustedCompanies.displayName = 'TrustedCompanies';

export default TrustedCompanies;
