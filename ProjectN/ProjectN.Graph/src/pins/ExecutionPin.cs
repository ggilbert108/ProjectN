namespace ProjectN.Graph
{
    public class ExecutionPin : Pin
    {
        public ExecutionPin(INode owner, PinType pinType) : base(owner, pinType)
        {

        }

        protected override void Send()
        {
            Connected.Owner.PrepareForExecute();
            Connected.Owner.Execute();
        }

        protected override void Receive()
        {
            throw new System.NotImplementedException();
        }
    }
}