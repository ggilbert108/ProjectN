namespace ProjectN.Graph
{
    public abstract class GetNode : INode
    {
        public abstract void PrepareForExecute();

        public abstract void Execute();
    }

    public class GetNode<T> : GetNode
    {
        protected DataPin<T> DataOut;
        protected Scope Scope;
        protected string Key;

        public GetNode(Scope scope, string key)
        {
            DataOut = new DataPin<T>(this, PinType.OUTPUT);
            Scope = scope;
            Key = key;
        }

        public override void PrepareForExecute()
        {
            DataOut.SetData(Scope.GetValue<T>(Key));
        }

        public override void Execute()
        {
            DataOut.SendOutput();
        }
    }
}