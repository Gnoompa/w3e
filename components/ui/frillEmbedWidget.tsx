import React from "react";

const FrillEmbeddedWidget: React.FC = React.memo(() => {
  const widgetRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    let widget;

    const config = {
      key: "7dea3683-39f6-44d3-8315-7c5f06052edd",
      type: "embed",
      container: widgetRef.current!,
      callbacks: {
        onReady: (frillWidget) => {
          widget = frillWidget;
        },
      },
      settings: {
        // Because we are using our own launcher I am going to use the `null` launcher type
        view: {
          type: "embed",
        },
      },
    };

    global.Frill_Config = global.Frill_Config || [];
    global.Frill_Config.push(config);

    if ("Frill" in global) {
      widget = global.Frill.widget(config);
    }

    return () => {
      widget?.destroy();
      if (global.Frill_Config) {
        global.Frill_Config = global.Frill_Config.filter((c) => c !== config);
      }
    };
  }, []);

  return (
    <div
      ref={widgetRef}
      className="frill-embedded"
      style={{ width: "100%", height: "100%" }}
    />
  );
});

export default FrillEmbeddedWidget;
