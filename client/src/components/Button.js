import { motion } from "framer-motion";

const Button = (props) => {
  const {
    content = "",
    onClick = () => {},
    color = "blue",
    disabled = false,
    height = "",
    width = "",
    className = "",
  } = props;

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.1 }}
      whileTap={{ scale: disabled ? 1 : 0.9 }}
      className={`tw-flex tw-flex-row tw-justify-center tw-items-center tw-rounded tw-border-[2px] tw-border-solid tw-border-[#CBD5E1] tw-px-[8px] tw-py-[8px] tw-duration-200 ${
        disabled
          ? "!tw-cursor-not-allowed tw-border-[#7e7f9a] tw-text-[#7e7f9a]"
          : color === "blue"
          ? `hover:tw-border-[#90ddf0] hover:tw-text-[#272838] hover:tw-bg-[#90ddf0]`
          : color === "red"
          ? `hover:tw-border-[#eb9486] hover:tw-text-[#272838] hover:tw-bg-[#eb9486]`
          : color === "green"
          ? `hover:tw-border-[#9ed8db] hover:tw-text-[#272838] hover:tw-bg-[#9ed8db]`
          : ""
      } ${height ? `tw-h-${height}` : ""} ${
        width ? `tw-w-${width}` : ""
      } ${className}`}
      onClick={disabled ? () => {} : onClick}
    >
      {content}
    </motion.button>
  );
};

export default Button;
