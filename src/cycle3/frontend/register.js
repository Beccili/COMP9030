form.addEventListener('submit',e=>{
  e.preventDefault();
  applyNameValidity();applyEmailValidity();applyPasswordValidity();applyUrlValidity();
  if(!form.checkValidity()){form.reportValidity();return;}
  (async()=>{
    try{
      const payload={name:nameInput.value.trim(),email:emailInput.value.trim(),password:passwordInput.value,role:roleSelect.value};
      const reg=await apiFetch('auth.php?action=register',{method:'POST',data:payload,session:false});
      if(!reg.success)throw new Error(reg.message||'Register failed');
      const list=loadAccounts();const id=idInput.value||uid();
      const localAcc={id,name:payload.name,email:payload.email,role:payload.role,region:regionSelect.value,nation:nationInput.value.trim(),imageUrl:imageInput.value.trim(),bio:bioInput.value.trim(),status:'pending',artworks:[]};
      const idx=list.findIndex(a=>a.id===id);
      if(idx>=0)list[idx]={...list[idx],...localAcc};else list.push(localAcc);
      saveAccounts(list);
      alert('Registered! Please wait for admin approval. Redirecting to account page...');
      setTimeout(()=>{window.location.href='account.html'},1000);
      form.reset();idInput.value='';document.getElementById('saveBtn').textContent='Submit';
    }catch(err){alert(err.message||'Register failed');}
  })();
});