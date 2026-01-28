"use client";

import { useEffect, useRef } from "react";
import { FaClipboardList, FaCogs, FaTasks, FaChartLine } from "react-icons/fa";


export default function Process() {
  return (
    <div>
      <div className="business-goal-area-2 rts-section-gap -mb-20 md:-mb-50">
        <div className="container">
          <div className="row">
            <div className="">
              <div className="consultancy-style-one">
                <div className="title-style-two left">
                  <span className="bg-content">Working Steps</span>
                  <span className="pre">Our Working Process</span>
                  <h2 className="title rts-text-anime-style-1">
                    Our Basic Work Process
                  </h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="working-process-area-three py-20 bg-[#f8f9fa] working-process-bg">
  <div className="container mx-auto px-4">
    {/* Working Steps Grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-12 rts_jump_animation-wrapper">
      {[
        {
          id: "01",
          title: "Understand Your Workflow",
          icon: FaClipboardList,
          inner:
            "",
          descripition:
            "We analyse your processes, challenges, and daily operational needs.",
        },
        {
          id: "02",
          title: "Build Clear Structure",
          icon: FaCogs,
          inner:
            "two",
          descripition:
            "We create checklists, routines, and workflows for consistent execution.",
        },
        {
          id: "03",
          title: "Execute Daily Support",
          icon: FaTasks,
          inner:
            "three",
          descripition:
            "Our team handles operations accurately across sales, admin, and IT.",
        },
        {
          id: "04",
          title: "Improve & Scale",
          icon: FaChartLine,
          inner:
            "four",
          descripition:
            "We refine processes continuously to support growth and efficiency.",
        },
      ].map((step) => {
        const Icon = step.icon;

        return (
          <div
            key={step.id}
            className="rts-working-process-1 text-center group rts-jump__item"
          >
            <div className={`inner ${step.inner} flex justify-center mb-6`}>
              <div className="icon bg-white p-6 rounded-full shadow-sm group-hover:shadow-md transition-all">
                <Icon className="w-12 h-12 text-gray-800" />
              </div>
            </div>

            <div className="content">
              <h6 className="title text-xl font-bold mb-3">
                {step.title}
              </h6>
              <p className="disc text-gray-600 leading-relaxed">
                {step.descripition}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  </div>
</div>

    </div>
  );
}
