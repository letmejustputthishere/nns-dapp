import 'package:dfinity_wallet/ui/_components/form_utils.dart';
import 'package:dfinity_wallet/ui/neurons/detail/proposal_summary_widget.dart';
import 'package:dfinity_wallet/ui/wallet/balance_display_widget.dart';

import '../../../dfinity.dart';

class NeuronHotkeysCard extends StatelessWidget {

  final Neuron neuron;

  const NeuronHotkeysCard({Key? key, required this.neuron}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final buttonStyle = ButtonStyle(
        foregroundColor: MaterialStateProperty.all(AppColors.white),
        minimumSize: MaterialStateProperty.all(Size.square(40)));
    return Card(
      color: AppColors.background,
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text("Hotkeys", style: context.textTheme.headline3),
            SmallFormDivider(),
            if (neuron.hotkeys.isEmpty) Center(
              child: Padding(
                 padding: EdgeInsets.symmetric(vertical: 12),
                child: Text(
                "no hotkeys",
                style: context.textTheme.bodyText1,
              ),
              )
            ),
            if (neuron.hotkeys.isNotEmpty)
              ...neuron.hotkeys.map((e) {
                return Container(
                  padding: EdgeInsets.all(8),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      SelectableText(e, style: context.textTheme.bodyText2),
                      TextButton(
                        style: buttonStyle,
                        onPressed: () {
                          removeHotkey(e, context);
                        },
                        child: Text('✕')
                      )
                    ],
                  ),
                );
              }),
          ],
        ),
      ),
    );
  }

  void removeHotkey(String hotkey, BuildContext context) {
    context.callUpdate(() async {
      print(hotkey);
      await context.icApi.removeHotkey(neuronId: neuron.id.toBigInt, principal: hotkey);
      return true;
    });
  }
}


