/* Feature tabs — mounted into #feat-tabs-root */
(function () {
  const {
    useState,
    useCallback
  } = React;
  const FT_FEATURES = [{
    id: 1,
    title: "Role-based dashboards",
    desc: "One login, personalised views for every role — from personal records to full team oversight.",
    cat: "core",
    icon: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("rect", {
      x: "3",
      y: "3",
      width: "7",
      height: "7",
      rx: "1.5"
    }), /*#__PURE__*/React.createElement("rect", {
      x: "14",
      y: "3",
      width: "7",
      height: "7",
      rx: "1.5"
    }), /*#__PURE__*/React.createElement("rect", {
      x: "3",
      y: "14",
      width: "7",
      height: "7",
      rx: "1.5"
    }), /*#__PURE__*/React.createElement("rect", {
      x: "14",
      y: "14",
      width: "7",
      height: "7",
      rx: "1.5"
    }))
  }, {
    id: 2,
    title: "Approval workflows",
    desc: "Submit and route absence reasons and incidents through configurable approval chains with audit trails.",
    cat: "workflow",
    icon: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
      d: "M12 20h9"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4z"
    }))
  }, {
    id: 3,
    title: "Shift management",
    desc: "Up to 3 shifts per day with customisable rule sets and flexible scheduling.",
    cat: "scheduling",
    icon: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("circle", {
      cx: "12",
      cy: "12",
      r: "10"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M12 6v6l4 2"
    }))
  }, {
    id: 4,
    title: "Multi-branch setup",
    desc: "Manage unlimited branches under one organisation — no limits, full control.",
    cat: "core",
    icon: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
      d: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M9 22V12h6v10"
    }))
  }, {
    id: 5,
    title: "Mobile app",
    desc: "Check in remotely with accurate, real-time syncing to the web console.",
    cat: "connect",
    note: true,
    icon: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("rect", {
      x: "6",
      y: "2",
      width: "12",
      height: "20",
      rx: "2"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M11 18h2"
    }))
  }, {
    id: 6,
    title: "Offense tracking",
    desc: "Colour-coded indicators help supervisors spot attendance patterns at a glance.",
    cat: "workflow",
    icon: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("circle", {
      cx: "12",
      cy: "12",
      r: "10"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M12 8v4M12 16h.01"
    }))
  }, {
    id: 7,
    title: "Public holidays",
    desc: "Bake regional holidays into shift rules — no manual exceptions.",
    cat: "scheduling",
    icon: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("rect", {
      x: "3",
      y: "4",
      width: "18",
      height: "18",
      rx: "2"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M16 2v4M8 2v4M3 10h18"
    }))
  }, {
    id: 8,
    title: "Notifications",
    desc: "Timely alerts for clock-ins, approvals, and exceptions — pushed to web and mobile.",
    cat: "connect",
    icon: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
      d: "M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M10.3 21a1.94 1.94 0 0 0 3.4 0"
    }))
  }, {
    id: 9,
    title: "Bilingual (BM / EN)",
    desc: "Switch the entire interface between Bahasa Malaysia and English in one click.",
    cat: "core",
    icon: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("circle", {
      cx: "12",
      cy: "12",
      r: "10"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10A15.3 15.3 0 0 1 8 12A15.3 15.3 0 0 1 12 2z"
    }))
  }, {
    id: 10,
    title: "Comprehensive reporting",
    desc: "Data-driven reports for workflow efficiency, staff synchronisation, and compliance.",
    cat: "connect",
    icon: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
      d: "M18 20V10M12 20V4M6 20v-6"
    }))
  }];
  const FT_CATS = [{
    id: "all",
    label: "All features"
  }, {
    id: "core",
    label: "Core Platform"
  }, {
    id: "workflow",
    label: "Workflow"
  }, {
    id: "scheduling",
    label: "Scheduling"
  }, {
    id: "connect",
    label: "Connect"
  }];
  function FeatureTabs() {
    const [activeTab, setActiveTab] = useState("all");
    const [fading, setFading] = useState(false);
    const [renderTab, setRenderTab] = useState("all");
    const switchTab = useCallback(function (id) {
      if (id === activeTab || fading) return;
      setFading(true);
      setActiveTab(id);
      setTimeout(function () {
        setRenderTab(id);
        setFading(false);
      }, 180);
    }, [activeTab, fading]);
    const filtered = renderTab === "all" ? FT_FEATURES : FT_FEATURES.filter(function (f) {
      return f.cat === renderTab;
    });
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "feat-tabs-row"
    }, FT_CATS.map(function (cat) {
      const isActive = activeTab === cat.id;
      const count = cat.id === "all" ? FT_FEATURES.length : FT_FEATURES.filter(function (f) {
        return f.cat === cat.id;
      }).length;
      return /*#__PURE__*/React.createElement("button", {
        key: cat.id,
        className: "feat-tab-pill" + (isActive ? " active" : ""),
        onClick: function () {
          switchTab(cat.id);
        }
      }, cat.label, /*#__PURE__*/React.createElement("span", {
        className: "feat-tab-count"
      }, count));
    })), /*#__PURE__*/React.createElement("div", {
      className: "feat-tab-grid" + (fading ? " ft-fading" : ""),
      key: renderTab
    }, filtered.map(function (f, i) {
      return /*#__PURE__*/React.createElement("div", {
        key: f.id,
        className: "feat-tab-card",
        style: {
          animationDelay: i * 55 + "ms"
        }
      }, /*#__PURE__*/React.createElement("div", {
        className: "ico ico-indigo"
      }, /*#__PURE__*/React.createElement("svg", {
        width: "18",
        height: "18",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round"
      }, f.icon)), /*#__PURE__*/React.createElement("h4", null, f.title, f.note && /*#__PURE__*/React.createElement("sup", null, "*")), /*#__PURE__*/React.createElement("p", null, f.desc));
    })));
  }
  function ftMount() {
    const el = document.getElementById('feat-tabs-root');
    if (!el || el.dataset.mounted || typeof ReactDOM === 'undefined') {
      if (!el || el.dataset.mounted) return;
      setTimeout(ftMount, 30);
      return;
    }
    el.dataset.mounted = '1';
    ReactDOM.createRoot(el).render(/*#__PURE__*/React.createElement(FeatureTabs, null));
  }
  ftMount();
})();
