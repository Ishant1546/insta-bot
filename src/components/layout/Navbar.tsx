
export default function Navbar() {
  function changeTheme(theme){
    document.body.className = theme;
    localStorage.setItem("theme", theme);
  }

  return (
    <div className="glass w-full mb-6 flex justify-between">
      <h2 className="text-xl font-semibold">Automation Control Panel</h2>

      <select 
        onChange={(e)=>changeTheme(e.target.value)}
        className="bg-transparent border border-white/20 px-3 py-1 rounded">
        <option value="theme-cyan">Cyan</option>
        <option value="theme-purple">Purple</option>
        <option value="theme-red">Red</option>
        <option value="theme-green">Green</option>
        <option value="theme-gold">Gold</option>
      </select>
    </div>
  );
}
