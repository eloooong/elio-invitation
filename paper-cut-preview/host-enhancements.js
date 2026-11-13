document.addEventListener('DOMContentLoaded', () => {
  const host=document.getElementById('host-view');
  const form=document.getElementById('invitation-form');
  const state=document.getElementById('host-save-state');
  const buttons=[...document.querySelectorAll('[data-editor-section]')];
  function showSection(name) {
    buttons.forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.editorSection===name)));
    host.querySelectorAll('[data-editor-panel]').forEach(panel=>panel.hidden=panel.dataset.editorPanel!==name);
  }
  buttons.forEach(button=>button.addEventListener('click',()=>showSection(button.dataset.editorSection)));
  form.addEventListener('host-reveal-field',event=>{
    const panel=event.target.closest('[data-editor-panel]');
    if(panel)showSection(panel.dataset.editorPanel);
    let parent=event.target.parentElement;
    while(parent&&parent!==form){if(parent.tagName==='DETAILS')parent.open=true;parent=parent.parentElement;}
  });
  const details=document.getElementById('editor-details');
  const wording=document.createElement('details');
  wording.className='host-wording';
  wording.innerHTML='<summary>Invitation wording <span>Welcome, dress code, gifts and journal text</span></summary><div class="editor-grid"></div>';
  ['welcome','dress','gifts','journalTitle','journalIntro'].forEach(key=>{
    const field=document.getElementById('edit-'+key)?.closest('.field');
    if(field)wording.querySelector('.editor-grid').append(field);
  });
  details.classList.add('editor-details-basics');
  details.after(wording);
  document.getElementById('host-add-reply').addEventListener('click',()=>{
    const manual=host.querySelector('.host-manual');manual.open=true;
    document.getElementById('manual-name').focus();
  });
  document.getElementById('toggle-host-passcode').addEventListener('click',event=>{
    const input=document.getElementById('host-passcode'),shown=input.type==='password';
    input.type=shown?'text':'password';event.currentTarget.textContent=shown?'Hide':'Show';
    event.currentTarget.setAttribute('aria-label',shown?'Hide passcode':'Show passcode');
    event.currentTarget.setAttribute('aria-pressed',String(shown));
  });
  document.getElementById('open-host').addEventListener('click',()=>{
    const input=document.getElementById('host-passcode');input.type='password';
    const toggle=document.getElementById('toggle-host-passcode');toggle.textContent='Show';toggle.setAttribute('aria-label','Show passcode');toggle.setAttribute('aria-pressed','false');
  });
  function dirty(){state.textContent='Unsaved changes';state.dataset.state='unsaved';}
  form.addEventListener('input',event=>{
    dirty();
    if(event.target.validity?.valid)event.target.removeAttribute('aria-invalid');
  });
  form.addEventListener('change',dirty);
  document.addEventListener('host-editor-status',event=>{
    const {message,error}=event.detail;
    if(error){state.textContent='Check your changes';state.dataset.state='error';}
    else if(/^Saved\b/.test(message)){state.textContent=message.startsWith('Saved online')?'Saved online':'Saved on this device';state.dataset.state='saved';}
    else if(/^Unsaved changes discarded/.test(message)){
      state.textContent='Changes discarded';state.dataset.state='saved';
      form.querySelectorAll('[aria-invalid]').forEach(input=>input.removeAttribute('aria-invalid'));
    }
    else if(/unsaved|save or preview/i.test(message))dirty();
  });
  form.addEventListener('click',event=>{
    if(event.target.closest('#add-faq,.faq-remove,[id^="edit-photo-remove-"]'))dirty();
  });
  if(document.getElementById('editor-status').classList.contains('error-state')){
    state.textContent='Review saved data';state.dataset.state='error';
  }
}, {once:true});
