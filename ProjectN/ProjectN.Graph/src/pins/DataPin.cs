namespace ProjectN.Graph
{
    public class DataPin<T> : Pin
    {
        public T Data { get; private set; }

        public DataPin(INode owner, PinType pinType) : base(owner, pinType)
        {

        }

        protected override void Send()
        {
            var otherPin = Connected as DataPin<T>;
            otherPin.Data = Data;
        }

        protected override void Receive()
        {
            var otherPin = Connected as DataPin<T>;
            Data = otherPin.Data;
        }

        public void SetData(T data)
        {
            Data = data;
        }
    }
}