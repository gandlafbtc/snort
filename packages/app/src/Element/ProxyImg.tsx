import useImgProxy from "Hooks/useImgProxy";
import { useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import { getUrlHostname } from "SnortUtils";

interface ProxyImgProps extends React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement> {
  size?: number;
}

export const ProxyImg = (props: ProxyImgProps) => {
  const { proxy } = useImgProxy();
  const [loadFailed, setLoadFailed] = useState(false);
  const [bypass, setBypass] = useState(false);

  if (loadFailed) {
    if (bypass) {
      return <img {...props} />;
    }
    return (
      <div
        className="note-invoice error"
        onClick={e => {
          e.stopPropagation();
          setBypass(true);
        }}>
        <FormattedMessage
          defaultMessage="Failed to proxy image from {host}, click here to load directly"
          values={{
            host: getUrlHostname(props.src),
          }}
        />
      </div>
    );
  }
  return (
    <img
      {...props}
      src={props.src ? proxy(props.src, props.size) : ""}
      onError={e => {
        if (props.onError) {
          props.onError(e);
        } else {
          setLoadFailed(true);
        }
      }}
    />
  );
};
