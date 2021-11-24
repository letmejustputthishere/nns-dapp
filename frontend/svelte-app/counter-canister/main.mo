actor {
    stable var currentValue: Nat8 = 250;

    public func increment(): async () {
        currentValue += 1;
    };

    public query func getValue(): async Nat8 {
        currentValue;
    };
};
