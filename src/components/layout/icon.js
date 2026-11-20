// Small fixed logo (a gif) in the top-left corner; styled in icon.css.
import Logo from "../../resources/art/background-project/gradients/orange-glob-marble-head.gif";

const Icon = () => {
  return (
    <div className="icon">
      <img src={Logo} alt="" />
    </div>
  );
};

export default Icon;