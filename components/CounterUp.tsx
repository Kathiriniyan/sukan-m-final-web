"use client";

import Image from "next/image";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";

export default function CounterUp() {
  const { ref, inView } = useInView({
    threshold: 0.35,
    triggerOnce: false,
  });

  const sectionStyle: React.CSSProperties = {
    paddingTop: 90,
    paddingBottom: 90,
    minHeight: "auto",
    height: "auto",
    overflow: "hidden",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  };

  const runKey = inView ? "run" : "stop";

  // Updated data with a 'symbol' field for mixed suffixes (+ or %)
  const counters = [
    { 
      id: "1", 
      end: 100, 
      symbol: "%", 
      label: "Execution Reliability", 
      icon: "/assets/images/counterup/icon/01.svg" 
    },
    { 
      id: "2", 
      end: 5, 
      symbol: "+", 
      label: "Core Service Verticals", 
      icon: "/assets/images/counterup/icon/02.svg" 
    },
    { 
      id: "3", 
      end: 100, 
      symbol: "%", 
      label: "Data Accuracy Focus", 
      icon: "/assets/images/counterup/icon/03.svg" 
    },
    { 
      id: "4", 
      end: 24, 
      symbol: "+", 
      label: "Global Time Zone Support", 
      icon: "/assets/images/counterup/icon/04.svg" 
    },
  ];

  return (
    <div ref={ref} className="rts-counter-up-area counter-bg" style={sectionStyle}>
      <div className="container">
        <div className="row g-4 justify-content-center">
          {counters.map((item) => (
            <div key={item.id} className="col-6 col-md-3">
              <div className="single-counter h-100">
                {/* ✅ tablet-friendly layout */}
                <div className="d-flex flex-column flex-sm-row align-items-center gap-3 text-center text-sm-start">
                  <div className="icon flex-shrink-0">
                    <Image src={item.icon} alt="Business_counter" width={60} height={60} />
                  </div>

                  <div className="counter-details">
                    <h2 className="counter title m-0">
                      {inView ? (
                        <CountUp
                          key={`${runKey}-${item.id}`}
                          start={0}
                          end={item.end}
                          duration={3.2}
                          separator=","
                        />
                      ) : (
                        "00"
                      )}
                      {/* Dynamic symbol rendering */}
                      {item.symbol}
                    </h2>
                    <p className="disc mb-0">{item.label}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}