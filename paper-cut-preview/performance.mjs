export function improvePerformance(html){
 const replace=(before,after)=>{if(!html.includes(before))throw new Error('Performance anchor missing: '+before.slice(0,60));html=html.replace(before,()=>after);};
 replace('      function drawRing() {','      let lastRingAngle = NaN;\n      function drawRing(force = true) {\n        if (!force && angle === lastRingAngle) return;\n        lastRingAngle = angle;');
 // Moving transforms follow the display refresh rate; unchanged frames still do no work.
 replace('        drawRing();\n        if (\n          ringVisible &&','        drawRing(false);\n        if (\n          ringVisible &&');
 replace(`          const fade =
            Math.abs(a) <= 60
              ? 1
              : Math.max(
                  0.08,
                  Math.cos((((Math.abs(a) - 60) / 120) * Math.PI) / 2) ** 2,
                );`,`          const edge = Math.max(0, Math.min(1, (Math.abs(a) - 55) / 30));
          const fade = Math.cos(edge * Math.PI / 2) ** 2;`);
 replace('          c.style.opacity = String(fade);','          const opacity = String(Math.round(fade * 1000) / 1000);\n          if(c.style.opacity !== opacity) c.style.opacity = opacity;');
 replace('          c.style.pointerEvents = Math.abs(a) < 85 ? "auto" : "none";', '          const front = Math.abs(a) < 85, pointer = front ? "auto" : "none", visibility = front ? "visible" : "hidden";\n          if(c.style.pointerEvents !== pointer)c.style.pointerEvents = pointer;');
 replace('          c.style.visibility = Math.abs(a) < 85 ? "visible" : "hidden";', '          if(c.style.visibility !== visibility)c.style.visibility = visibility;');
 replace('          c.setAttribute("aria-hidden", String(Math.abs(a) >= 85));', '          if(c.getAttribute("aria-hidden") !== String(!front))c.setAttribute("aria-hidden", String(!front));');
 replace('          c.tabIndex = i === active ? 0 : -1;', '          if(c.tabIndex !== (i===active?0:-1))c.tabIndex = i===active?0:-1;');
 replace('          c.setAttribute("aria-current", String(i === active));', '          if(c.getAttribute("aria-current") !== String(i===active))c.setAttribute("aria-current", String(i === active));');
 // A critically damped spring keeps release velocity and settles without a long coast.
 replace(`            angle += (target - angle) * (1 - Math.exp(-12 * dt));
            if (Math.abs(target - angle) < 0.03) {
              angle = target;
              target = null;
            }
          } else if (Math.abs(velocity) > 0.6) {
            angle += velocity * dt;
            velocity *= Math.exp(-5 * dt);
            if (Math.abs(velocity) <= 0.6) target = Math.round(angle / 30) * 30;
          } else if (`,`            const offset = angle - target, omega = 20;
            const decay = Math.exp(-omega * dt);
            const travel = (velocity + omega * offset) * dt;
            angle = target + (offset + travel) * decay;
            velocity = (velocity - omega * travel) * decay;
            if (Math.abs(target - angle) < 0.015 && Math.abs(velocity) < 0.2) {
              angle = target;
              velocity = 0;
              target = null;
            }
          } else if (`);
 replace(`      $("#prev-month").addEventListener("click", () => goTo(currentMonth - 1));
      $("#next-month").addEventListener("click", () => goTo(currentMonth + 1));`,`      const selectedMonth = () => wrap(Math.round(-(target ?? angle) / 30));
      $("#prev-month").addEventListener("click", () => goTo(selectedMonth() - 1));
      $("#next-month").addEventListener("click", () => goTo(selectedMonth() + 1));`);
 replace(`        target = angle + ((((desired - angle + 540) % 360) + 360) % 360) - 180;
        velocity = 0;`,`        target = angle + ((((desired - angle + 540) % 360) + 360) % 360) - 180;`);
 replace('          goTo(currentMonth + (e.key === "ArrowRight" ? 1 : -1));','          goTo(selectedMonth() + (e.key === "ArrowRight" ? 1 : -1));');
 replace(`        velocity =
          ((e.clientX - drag.lastX) * 0.22) /
          Math.max(0.008, (now - drag.lastT) / 1000);`,`        const sample = ((e.clientX - drag.lastX) * 0.22) /
          Math.max(0.008, (now - drag.lastT) / 1000);
        velocity = velocity * 0.35 + sample * 0.65;`);
 replace(`        drag.lastT = now;
        drawRing();`,`        drag.lastT = now;
        wakeRing();`);
 replace(`          } else if (Math.abs(velocity) < 0.6)
            target = Math.round(angle / 30) * 30;`,`          } else {
            target = Math.round((angle + velocity * 0.12) / 30) * 30;
          }`);
 replace('          if (ringVisible) wakeRing();','          stage.classList.toggle("ring-visible", ringVisible);\n          if (ringVisible) wakeRing();');
 replace('      startMusic();\n\n      function greet', '      // The first guest interaction starts music; it does not compete with first paint.\n\n      function greet');
 html=html.replace(/(<audio\b[\s\S]*?preload=")auto("[\s\S]*?<\/audio>)/, '$1none$2');
 return html;
}
