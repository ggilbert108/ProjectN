namespace ProjectN.Graph
{
    public class ConditionNode : INode
    {
        public ExecutionPin ExecutionIn { get; private set; }
        public DataPin<bool> ConditionIn { get; private set; }

        public ExecutionPin ExecutionTrueOut { get; private set; }
        public ExecutionPin ExecutionFalseOut { get; private set; }

        public ConditionNode()
        {
            ExecutionIn = new ExecutionPin(this, PinType.INPUT);
            ConditionIn = new DataPin<bool>(this, PinType.INPUT);

            ExecutionTrueOut = new ExecutionPin(this, PinType.OUTPUT);
            ExecutionFalseOut = new ExecutionPin(this, PinType.INPUT);
        }

        public void PrepareForExecute()
        {
            ConditionIn.RecieveInput();
        }

        public void Execute()
        {
            if (ConditionIn.Data)
            {
                ExecutionTrueOut.SendOutput();
            }
            else
            {
                ExecutionFalseOut.SendOutput();
            }
        }
    }
}