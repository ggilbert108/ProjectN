namespace ProjectN.Graph
{
    public class ForNode : INode
    {
        protected ExecutionPin ExecutionIn;
        protected DataPin<int> StartIndexIn;
        protected DataPin<int> EndIndexIn;
        private ExecutionPin hiddenIn;

        protected ExecutionPin LoopBodyOut;
        protected ExecutionPin LoopFinishedOut;
        private ExecutionPin hiddenOut;

        private int index;
        private int maxIndex;

        public ForNode(int startIndex = -1, int maxIndex = -1)
        {
            ExecutionIn = new ExecutionPin(this, PinType.INPUT);
            StartIndexIn = new DataPin<int>(this, PinType.INPUT);
            EndIndexIn = new DataPin<int>(this, PinType.INPUT);
            hiddenIn = new ExecutionPin(this, PinType.INPUT);

            LoopBodyOut = new ExecutionPin(this, PinType.OUTPUT);
            LoopFinishedOut = new ExecutionPin(this, PinType.OUTPUT);
            hiddenOut = new ExecutionPin(this, PinType.OUTPUT);

            hiddenOut.Connect(hiddenIn);

            index = startIndex;
            maxIndex = index;
        }

        public void PrepareForExecute()
        {
            if (index == maxIndex && index == -1)
            {
                StartIndexIn.RecieveInput();
                EndIndexIn.RecieveInput();

                index = StartIndexIn.Data;
                maxIndex = EndIndexIn.Data;
            }
        }

        public void Execute()
        {
            if (index == maxIndex)
            {
                LoopFinishedOut.SendOutput();
                return;
            }

            index++;
            LoopBodyOut.SendOutput();
            hiddenOut.SendOutput();
        }
    }
}