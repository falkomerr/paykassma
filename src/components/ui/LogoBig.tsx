export const LogoBig = () => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      {/* Логотип Paykassma */}
      <svg
        width="164"
        height="191"
        viewBox="0 0 164 191"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <path
          d="M23.4564 33.8481C23.9708 26.6265 24.228 23.0157 25.7093 20.2186C27.2992 17.2165 29.8632 14.8414 32.9779 13.4854C35.88 12.222 39.5207 12.2414 46.8021 12.2801L61.4543 12.3581C63.8521 12.3708 65.7891 14.3182 65.7891 16.716L59.684 118.616C59.35 124.189 59.1831 126.976 59.9135 129.203C61.0519 132.674 63.6751 135.459 67.0719 136.803C69.2513 137.665 72.043 137.665 77.6266 137.665C83.2926 137.665 86.1257 137.665 88.3241 138.545C91.7509 139.916 94.3805 142.754 95.4866 146.275C96.1962 148.534 95.9805 151.359 95.5492 157.009L95.4783 157.937C94.9453 164.919 94.6788 168.409 93.2846 171.112C91.6563 174.269 88.9607 176.745 85.6776 178.1C82.8666 179.261 79.3658 179.231 72.3641 179.171L13.4614 178.667C14.0271 166.694 20.4417 76.1681 23.4564 33.8481Z"
          fill="url(#paint0_linear_74_57)"
          fillOpacity="0.5"
        />
        <path
          d="M68.6093 40.4878C69.5721 27.3203 70.0535 20.7366 74.3711 16.7232C78.6888 12.7097 85.3007 12.7097 98.5245 12.7097L151.26 12.7097L144.451 106.082C143.489 119.275 143.008 125.871 138.69 129.886C134.372 133.9 127.759 133.9 114.531 133.9H61.8345C62.348 126.229 66.1717 73.8266 68.6093 40.4878Z"
          fill="url(#paint1_linear_74_57)"
          fillOpacity="0.5"
        />
        <path
          d="M118.139 0.986328H36.8203C24.1276 0.986328 13.4908 10.7786 12.6061 23.2807L0.757812 190.562H82.0769C94.7697 190.562 105.406 180.77 106.291 168.269L107.9 145.522H130.882C143.575 145.522 154.212 135.73 155.097 123.228L163.758 0.986328H118.139ZM104.477 13.9291L96.0765 132.995H63.1709L70.877 24.1541C71.0225 20.1783 74.7815 13.9291 82.2747 13.9291H104.477ZM93.6386 167.395C93.2164 173.366 88.1393 178.04 82.0769 178.04H14.3604L25.4817 24.2277C25.907 19.1853 29.3309 13.9291 36.7512 13.9291H61.0823C59.4537 16.8672 58.4759 19.7519 58.2245 23.2807L49.5683 145.522H95.1869L93.6386 167.395ZM142.449 122.354C142.027 128.325 136.95 133 130.887 133H108.789L117.255 13.5083H150.16L142.449 122.354Z"
          fill="url(#paint2_linear_74_57)"
        />
        <defs>
          <linearGradient
            id="paint0_linear_74_57"
            x1="16.8461"
            y1="178.804"
            x2="110.988"
            y2="12.6949"
            gradientUnits="userSpaceOnUse">
            <stop stopColor="#4B4B4B" />
            <stop offset="0.337101" stopColor="#2A282B" />
            <stop offset="1" stopColor="#060606" />
          </linearGradient>
          <linearGradient
            id="paint1_linear_74_57"
            x1="65.4566"
            y1="133.501"
            x2="118.682"
            y2="-5.14776"
            gradientUnits="userSpaceOnUse">
            <stop stopColor="#4B4B4B" />
            <stop offset="0.337101" stopColor="#2A282B" />
            <stop offset="1" stopColor="#060606" />
          </linearGradient>
          <linearGradient
            id="paint2_linear_74_57"
            x1="0.757812"
            y1="95.7744"
            x2="163.758"
            y2="95.7744"
            gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFD01F" />
            <stop offset="0.302885" stopColor="#FFFD64" />
            <stop offset="1" stopColor="#FFC61D" />
          </linearGradient>
        </defs>
      </svg>
      <div
        style={{
          filter: 'drop-shadow(0px 5.72px 48.66px rgba(254, 207, 77, 0.4))',
          color: '#ffffff',
        }}>
        <div
          className="daysone"
          style={{
            fontWeight: 400,
            fontSize: 75,
            lineHeight: '110%',
            letterSpacing: '0%',
            verticalAlign: 'middle',
            textTransform: 'uppercase',
          }}>
          AYKASSMA.
        </div>
        <div
          className="daysone"
          style={{
            fontWeight: 400,
            fontSize: 75,
            lineHeight: '110%',
            letterSpacing: '0%',
            verticalAlign: 'middle',
            textTransform: 'uppercase',
          }}>
          <span>P</span>
          <span style={{ opacity: 0.92 }}>ART</span>
          <span>NERS</span>
        </div>
      </div>
    </div>
  );
};
