function UserListHeader() {
  return (
    <div className="grid w-full px-5 py-3 text-xs font-semibold text-slate-500"
         style={{
           display: 'grid',
           gridTemplateColumns: '2fr 2fr 1fr 1fr 1fr',
           gap: '1rem',
         }}>
      <div className="text-left">Utilisateur</div>
      <div className="text-left">Email</div>
      <div className="text-left">Rôle</div>
      <div className="text-left">Date de création</div>
      <div className="text-right pr-1">Statut</div>
    </div>
  );
}
  
export default UserListHeader;