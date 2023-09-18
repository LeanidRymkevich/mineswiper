export default class ThemeChanger {
  constructor(defaultTheme) {
    this.trigger = document.createElement('button');
    this.themes = document.head.querySelectorAll('[data-theme]');
    this.currentThemeName = defaultTheme;
    this.nextThemeName = defaultTheme;
  }

  getTrigger(){
    this.changeTheme(this.currentThemeName);
    this.trigger.onclick = this.triggerHandler.bind(this);
    return this.trigger;
  }

  triggerHandler() {
    this.currentThemeName = this.nextThemeName;
    this.changeTheme(this.currentThemeName);
  }

  changeTheme(currentThemeName){
    this.nextThemeName = currentThemeName === 'light' ? 'dark' : 'light';
    this.themes.forEach(item => item.disabled = item.dataset.theme === currentThemeName ? false : true);
    this.trigger.textContent = `Change to the ${this.nextThemeName} theme`;
  }
}