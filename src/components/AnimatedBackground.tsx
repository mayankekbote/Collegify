import React from "react";
import "./AnimatedBackground.css"; // 👈 import the CSS file

const AnimatedBackground = () => {
  return (
    <div className="bg-animation">
      {/* Morphing Gradient Orbs */}
      <div className="gradient-orbs">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
        <div className="orb orb-4"></div>
      </div>

      {/* Floating Knowledge Symbols */}
      <div className="knowledge-symbols">
        <div className="symbol symbol-1">∫</div>
        <div className="symbol symbol-2">∑</div>
        <div className="symbol symbol-3">π</div>
        <div className="symbol symbol-4">∆</div>
        <div className="symbol symbol-5">λ</div>
        <div className="symbol symbol-6">∞</div>
        <div className="symbol symbol-7">Ω</div>
      </div>

      {/* DNA Helix Animation */}
      <div className="dna-helix">
        <div className="helix-strand"></div>
        <div className="helix-strand"></div>
      </div>

      {/* Floating Code Snippets */}
      <div className="code-snippets">
        <div className="code-snippet code-1">
          <code>function calculateGrade() {"{"} return 'A+'; {"}"}</code>
        </div>
        <div className="code-snippet code-2">
          <code>while(learning) {"{"} knowledge++; {"}"}</code>
        </div>
        <div className="code-snippet code-3">
          <code>if(dream === true) {"{"} achieve(); {"}"}</code>
        </div>
      </div>

      {/* Circuit Board Pattern */}
      <div className="circuit-board"></div>

      {/* Mathematical Equations */}
      <div className="math-equations">
        <div className="equation eq-1">E = mc²</div>
        <div className="equation eq-2">∮ E⃗ · dA⃗ = Q/ε₀</div>
        <div className="equation eq-3">∇²ψ + k²ψ = 0</div>
      </div>

      {/* Pulsing Energy Lines */}
      <div className="energy-lines">
        <div className="energy-line line-1"></div>
        <div className="energy-line line-2"></div>
        <div className="energy-line line-3"></div>
      </div>
    </div>
  );
};

export default AnimatedBackground;
