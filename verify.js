var bitcore = require('bitcore-lib')

var Script = bitcore.Script;
var Interpreter = bitcore.Script.Interpreter;
var Transaction = bitcore.Transaction

var interpreter = new Interpreter()

var scriptPubkey = new Script()
  .add('OP_HASH160')
  .add(new Buffer('8d0568a276c6f99218423fd95ee44dbb686ebddd', 'hex'))
  .add('OP_EQUAL')

var tx = new Transaction('0100000001214279dbf636e02cd6c40fda313e96f01502883393067ee165e35af40a44ad3b01000000fd080100483045022100e8afef82cc25d743c42b93e23707096ecdb90797d39fab183e81e233b9acb4460220359045af02bd4bd9421c06e95d33654670c29fe5eb858cd35c5b387786738d2e0147304402206ad34c53826bdc19afa04fe5fe392bb658446c0f3856abf71d2674391c5adff602205df8a576b953810c01ea899c31eda1180cbd4de472e1f6fe7f2bffa59e30987101514c73635221033b29afadb7f4ef05659d5a2862af44cbe713490c28ae1bd704f02446490a19fa21021c308b874b69df67ef67795243ee81cbbe7c32e22d92e5127c253504599138ba52ae6703809009b17521033b29afadb7f4ef05659d5a2862af44cbe713490c28ae1bd704f02446490a19faad68ffffffff01905f0100000000001976a9144eb9ea59ef457ee87b3a73f2dfec47faac36eb7688ac00000000')

var scriptSig = tx.inputs[0].script
console.log(scriptSig)

var flags = Interpreter.SCRIPT_VERIFY_P2SH
| Interpreter.SCRIPT_VERIFY_STRICTENC
| Interpreter.SCRIPT_VERIFY_SIGPUSHONLY
| Interpreter.SCRIPT_VERIFY_NULLDUMMY
| Interpreter.SCRIPT_VERIFY_DERSIG
// | Interpreter.SCRIPT_VERIFY_LOW_S
| Interpreter.SCRIPT_VERIFY_MINIMALDATA
| Interpreter.SCRIPT_VERIFY_CHECKLOCKTIMEVERIFY

var verified = interpreter.verify(scriptSig, scriptPubkey, tx, 0, flags);

console.log(verified, interpreter)
