const Input = (props) => {
  const {
    value = "",
    placeholder = "",
    onChange = () => {},
    onBlur = () => {},
    hasError = false,
    errorMessage = "",
    className = "",
    type = "search",
    centerText = false,
  } = props;

  return (
    <div className="tw-flex tw-flex-col tw-gap-[8px]">
      <input
        value={value}
        onChange={(event) => {
          return onChange(event.target.value);
        }}
        placeholder={placeholder}
        onBlur={onBlur}
        type={type}
        className={`${
          centerText ? "tw-text-center" : ""
        } tw-px-[8px] tw-py-[4px] tw-text-ellipsis focus:tw-rounded focus:tw-border-[2px] focus:tw-border-solid focus:tw-border-[#90ddf0] tw-border-[2px] tw-border-transparent focus:tw-outline-none tw-shadow-none tw-bg-transparent tw-border-b-solid tw-border-b-[#CBD5E1] hover:tw-border-b-[#90ddf0] tw-duration-200 ${
          hasError
            ? "tw-border-b-[#eb9486] hover:tw-border-b-[#eb9486] focus:tw-border-[#eb9486]"
            : ""
        } ${className}`}
      />
      {hasError ? (
        <div className="tw-text-xs tw-text-[#eb9486]">{errorMessage}</div>
      ) : null}
    </div>
  );
};

export default Input;
