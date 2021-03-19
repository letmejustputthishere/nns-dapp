import 'package:dfinity_wallet/data/canister.dart';
import 'package:dfinity_wallet/data/neuron.dart';
import 'package:dfinity_wallet/data/transaction.dart';
import 'package:dfinity_wallet/data/wallet.dart';
import 'package:hive/hive.dart';
import 'package:hive_flutter/hive_flutter.dart';

class HiveCoordinator {

  Box<Canister>? canisters;
  Box<Wallet>? wallets;
  Box<Neuron>? neurons;
  static Future? hiveInitFuture;
  Future<dynamic>? loadingFuture;

  HiveCoordinator() {
    openBoxes();
  }

  bool get boxesClosed => canisters == null || wallets == null || neurons == null;

  Future<void> openBoxes() async {
    if (boxesClosed) {
      if (hiveInitFuture == null) {
        hiveInitFuture = initializeHive();
        await hiveInitFuture;
      }else{
        await hiveInitFuture;
      }
      if(loadingFuture == null){
        loadingFuture = Future.wait([
          Hive.openBox<Canister>('canisters').then((value) => canisters = value),
          Hive.openBox<Wallet>('wallets').then((value) => wallets = value),
          Hive.openBox<Neuron>('neurons').then((value) => neurons = value)
        ]);
      }
      await loadingFuture;
    }
  }

  Future initializeHive() async {
    await Hive.initFlutter();
    Hive.registerAdapter(WalletAdapter());
    Hive.registerAdapter(TransactionAdapter());
    Hive.registerAdapter(NeuronAdapter());
    Hive.registerAdapter(CanisterAdapter());
  }
}