import 'package:dfinity_wallet/dfinity.dart';
import 'package:flutter/material.dart';

class AuthCountdown extends StatefulWidget {
  final levelClock;

  AuthCountdown({required this.levelClock});

  @override
  _AuthCountdownState createState() =>
      _AuthCountdownState(levelClock: levelClock);
}

class _AuthCountdownState extends State<AuthCountdown>
    with TickerProviderStateMixin {
  final int levelClock;

  _AuthCountdownState({required this.levelClock});
  late AnimationController _controller;

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  void initState() {
    super.initState();

    _controller = AnimationController(
        vsync: this,
        duration: Duration(
            seconds:
                levelClock) // gameData.levelClock is a user entered number elsewhere in the applciation
        );

    _controller.forward();
  }

  @override
  Widget build(BuildContext context) {
    print("sessionExpiresIn: $levelClock");
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: <Widget>[
        Countdown(
          animation: StepTween(
            begin: levelClock, // THIS IS A USER ENTERED NUMBER
            end: 0,
          ).animate(_controller),
        ),
      ],
    );
  }
}

class Countdown extends AnimatedWidget {
  Countdown({Key? key, required this.animation})
      : super(key: key, listenable: animation);
  final Animation<int> animation;

  @override
  build(BuildContext context) {
    Duration clockTimer = Duration(seconds: animation.value);

    var minutes = clockTimer.inMinutes.remainder(60).toString();
    var seconds = clockTimer.inSeconds.remainder(60).toString().padLeft(2, '0');

    return Text(
      "$minutes: $seconds ",
      style: TextStyle(
        color: AppColors.white,
      ),
    );
  }
}
