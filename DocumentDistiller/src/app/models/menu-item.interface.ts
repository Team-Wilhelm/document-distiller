export interface MenuItem {
  title: string;
  children: MenuItem[];
  id: string;
  onClick?: () => void;
}
