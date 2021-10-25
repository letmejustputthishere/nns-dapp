import 'package:nns_dapp/ui/_components/responsive.dart';

import '../../nns_dapp.dart';

class WizardOverlay extends StatefulWidget {
  final Widget rootWidget;
  final String rootTitle;
  final BuildContext buildContext;

  WizardOverlay(
      {Key? key,
      required this.rootTitle,
      required this.rootWidget,
      required this.buildContext})
      : super(key: key);

  static WizardOverlayState of(BuildContext context) =>
      context.findAncestorStateOfType<WizardOverlayState>()!;

  @override
  WizardOverlayState createState() => WizardOverlayState();
}

class WizardOverlayState extends State<WizardOverlay> {
  final GlobalKey navigatorKey = GlobalKey();

  List<MaterialPage> pages = [];

  @override
  void initState() {
    super.initState();
    pages.add(createPage(
        title: widget.rootTitle,
        widget: widget.rootWidget,
        context: widget.buildContext));
  }

  void pushPage(String? title, Widget widget, BuildContext context) {
    setState(() {
      pages.add(createPage(title: title, widget: widget, context: context));
    });
  }

  void replacePage(String? title, Widget widget, BuildContext context) {
    setState(() {
      pages.clear();
      pages.add(createPage(title: title, widget: widget, context: context));
    });
  }

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: EdgeInsets.zero,
      color: AppColors.transparent,
      child: ClipRRect(
        borderRadius: BorderRadius.circular(20),
        child: Navigator(
          key: navigatorKey,
          pages: List.of(pages),
          onPopPage: ((route, result) {
            final didPop = route.didPop(result);
            if (!didPop) {
              return false;
            }
            setState(() {
              pages.remove(route.settings);
            });
            return true;
          }),
        ),
      ),
    );
  }

  MaterialPage createPage(
          {String? title,
          required Widget widget,
          required BuildContext context}) =>
      MaterialPage(
          child: Scaffold(
              backgroundColor: AppColors.lighterBackground,
              appBar: (title != null)
                  ? AppBar(
                      backgroundColor: AppColors.lighterBackground,
                      actions: [
                        AspectRatio(
                            aspectRatio: 1,
                            child: TextButton(
                              onPressed: () {
                                OverlayBaseWidget.of(context)?.dismiss();
                                print("Overlay x has been pressed");
                              },
                              child: Center(
                                child: Text(
                                  "✕",
                                  style: TextStyle(
                                      fontFamily: Fonts.circularBook,
                                      fontSize: 20,
                                      color: AppColors.white),
                                ),
                              ),
                            )),
                      ],
                      title: Text(title,
                          overflow: TextOverflow.visible,
                          style: TextStyle(
                              fontSize: Responsive.isMobile(context) ? 15 : 25,
                              fontFamily: Fonts.circularBook,
                              color: AppColors.gray50)),
                    )
                  : null,
              body: widget));
}
