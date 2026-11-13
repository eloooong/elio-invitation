export function refineHost(html) {
  const replace=(from,to)=>{if(!html.includes(from))throw new Error('Host UI anchor missing: '+from.slice(0,65));html=html.replace(from,()=>to);};
  const original=html.match(/<main id="host-view"[\s\S]*?<\/main>/)?.[0];
  if(!original)throw new Error('Host view missing');
  let host=original.replace('Sighting log','Host dashboard').replace('Every explorer, accounted for.','Manage guest replies and update Elio’s invitation.');
  host=host.replace('Guest list\n','Guest replies\n').replace('>Edit invitation\n','>Invitation settings\n');
  host=host.replace('<span>Guests coming</span>','<span>Guests attending</span>').replace('<span>Said yes</span>','<span>Attending replies</span>').replace('<span>Can\'t come</span>','<span>Declined replies</span>');
  host=host.replace('<p class="label eyebrow">Make it yours</p>','').replace('<h2 id="editor-title">Edit the invitation</h2>','<h2 id="editor-title">Invitation settings</h2>');
  host=host.replace(/<p class="section-desc">[\s\S]*?<\/p>/,'<p class="section-desc">Update the party details, guest questions or photos. Save changes on this device, then use Save &amp; preview to see the result.</p>');
  const sections=['details','questions','photos'];let fieldset=0;
  host=host.replace(/<fieldset class="editor-section">/g,()=>`<fieldset class="editor-section" data-editor-panel="${sections[fieldset++]}"${fieldset>1?' hidden':''}>`);
  host=host.replace('<legend>Invitation details</legend>','<legend>Party details</legend>').replace('<legend>Helpful answers</legend>','<legend>Guest questions</legend>');
  const status=host.match(/<p id="editor-status"[^>]*><\/p>/)?.[0];
  let actions=host.match(/<div class="editor-actions">[\s\S]*?<\/div>/)?.[0];
  if(fieldset!==3||!status||!actions)throw new Error('Editor structure mismatch');
  const download=actions.match(/<button\b[^>]*id="download-invitation"[\s\S]*?<\/button>/)?.[0];
  const discard=actions.match(/<button\b[^>]*id="discard-invitation"[\s\S]*?<\/button>/)?.[0];
  if(!download||!discard)throw new Error('Editor tools missing');
  host=host.replace(status,'').replace(actions,'');
  actions=actions.replace(download,'').replace(discard,'').replace('Preview invitation<svg','Save &amp; preview<svg');
  const editorNav=`<div class="host-editor-nav" role="group" aria-label="Invitation sections">${[['details','Details'],['questions','Questions'],['photos','Photos']].map(([id,label],i)=>`<button type="button" data-editor-section="${id}" aria-pressed="${i===0}" aria-controls="host-edit-${id}">${label}</button>`).join('')}</div>`;
  host=host.replace('<form id="invitation-form" novalidate>',`${editorNav}<form id="invitation-form" novalidate><div class="host-savebar"><div class="host-save-summary"><span id="host-save-state">Saved version loaded</span>${status}</div>${actions}</div><details class="host-editor-tools"><summary>More options</summary><div class="host-editor-tools-menu">${download.replace('Download HTML','Download invitation')}${discard}</div></details>`);
  host=host.replace(/data-editor-panel="([^"]+)"/g,(_,name)=>`id="host-edit-${name}" data-editor-panel="${name}"`);
  const exports=host.match(/<div class="button-row host-footer">[\s\S]*?<\/div>/)?.[0];
  if(!exports)throw new Error('Guest export tools missing');
  const exportButtons=exports.replace(/^<div[^>]*>/,'').replace(/<\/div>$/,'').replace('Save as CSV','Download CSV');
  host=host.replace(exports,'');
  const toolbar=`<div class="host-replies-toolbar"><h2 id="host-replies-title">Guest replies</h2><div class="host-list-actions"><button type="button" class="btn green" id="host-add-reply">Add reply</button><details class="host-export-tools"><summary>Export guest list</summary><div class="host-export-menu">${exportButtons}</div></details></div></div><div class="host-search field"><label for="host-search">Find a guest</label><input type="search" id="host-search" placeholder="Search names, messages or food needs" autocomplete="off"/></div>`;
  host=host.replace('<div class="filter-chips"',toolbar+'<div class="filter-chips"');
  host=host.replace('<div id="host-replies"','<p id="host-result-count" class="small muted"></p><div id="host-replies"');
  host=host.replace(/<section class="paper-card host-panel">[\s\S]*?<\/section>/,section=>`<details class="host-food"><summary>Food needs <span id="host-food-count"></span></summary>${section.replace('<h2>Food notes</h2>','')}</details>`);
  host=host.replace('Add a reply you got by message','Add a guest reply');
  html=html.replace(original,()=>host);
  replace('Hello, hosts.','Host sign-in');
  replace('<p class="label eyebrow">Expedition leaders only</p>','');
  replace('>Open log<','>Open dashboard<');
  html=html.replace(/(<input\s+id="host-passcode"[\s\S]*?\/>)/,'<div class="host-passcode-field">$1<button type="button" id="toggle-host-passcode" aria-label="Show passcode" aria-pressed="false">Show</button></div>');
  replace('This demo shows replies saved on this device only. Connect a shared backend before sending the invitation to guests. The passcode is a light gate, not secure authentication.','Local preview: replies and invitation edits stay in this browser. They do not sync to other devices.');
  replace('const food = yes.filter((r) => r.diet);','const food = yes.filter((r) => r.diet);\n        put("#host-food-count", food.length ? "· " + food.length + (food.length === 1 ? " reply" : " replies") : "· None reported");');
  replace('const records = hostRecords.filter(\n          (r) => filter === "all" || r.going === (filter === "yes"),\n        );',`const query = $("#host-search").value.trim().toLocaleLowerCase();
        const records = hostRecords.filter(r => (filter === "all" || r.going === (filter === "yes")) && (!query || [r.name,r.note,r.diet].join(" ").toLocaleLowerCase().includes(query)));
        put("#host-result-count", records.length + " of " + hostRecords.length + " replies");
        $$("[data-filter]").forEach(button => {
          const kind=button.dataset.filter, count=kind==="all"?hostRecords.length:hostRecords.filter(r=>r.going===(kind==="yes")).length;
          button.textContent=({all:"All",yes:"Coming",no:"Can't come"}[kind])+" ("+count+")";
        });`);
  replace('"No sightings here yet."','"No matching replies"');
  replace('"Your expedition starts here."','"No replies yet"');
  replace('"Try another filter to see your explorers."','"Try a different name or reply filter."');
  replace('"Replies saved in this browser will appear here. Send a test RSVP, or add the first reply you received by message below."','"Guest replies saved in this browser appear here. Use Add reply for a response received by message."');
  replace('      $("#manual-going").addEventListener(',`      $("#host-search").addEventListener("input", renderReplyList);
      $("#manual-going").addEventListener(`);
  replace('"Explorer added to the log."','"Guest reply added."');
  replace('        const documentCopy = new DOMParser().parseFromString(\n          invitationSource,',`        let downloadSource = invitationSource;
        if (CLOUD_BACKEND) {
          try {
            const template = await fetch("/offline-template.html");
            if (!template.ok) throw new Error("Template unavailable");
            downloadSource = await template.text();
          } catch {
            editorStatus("The download could not be prepared. Please try again.", true);
            return;
          }
        }
        const documentCopy = new DOMParser().parseFromString(
          downloadSource,`);
  replace('const invalid = $("#invitation-form :invalid");','const invalid = $("#invitation-form input:invalid, #invitation-form textarea:invalid, #invitation-form select:invalid");');
  replace('        if (invalid) {\n          editorStatus(',`        if (invalid) {
          invalid.setAttribute("aria-invalid", "true");
          invalid.dispatchEvent(new Event("host-reveal-field", {bubbles:true}));
          editorStatus(`);
  replace(String.raw`";\n" +
          configScript.textContent.slice(`,String.raw`";\nconst CLOUD_BACKEND = false;\n" +
          configScript.textContent.slice(`);
  replace('$("#editor-status").classList.toggle("error-state", error);','$("#editor-status").classList.toggle("error-state", error);\n        document.dispatchEvent(new CustomEvent("host-editor-status", {detail:{message,error}}));');
  replace(`          $("#editor-status").scrollIntoView({
            block: "center",
            behavior: "smooth",
          });`,`          const invalidTime = error.message.includes("party must finish") ? $("#edit-end") : error.message.includes("RSVP deadline") ? $("#edit-rsvpBy") : null;
          if (invalidTime) {
            invalidTime.setAttribute("aria-invalid", "true");
            invalidTime.dispatchEvent(new Event("host-reveal-field", {bubbles:true}));
            invalidTime.focus();
          } else $("#editor-status").scrollIntoView({block:"center", behavior:"smooth"});`);
  return html;
}
