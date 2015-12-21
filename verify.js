var bitcore = require('bitcore-lib')

var Script = bitcore.Script;
var Interpreter = bitcore.Script.Interpreter;
var Transaction = bitcore.Transaction

var interpreter = new Interpreter()

var scriptPubkey = new Script()
  .add('OP_HASH160')
  .add(new Buffer('9d591f30cbf7ccb6a992e19d6a22e9ee6595925b', 'hex'))
  .add('OP_EQUAL')

var tx = new Transaction('0100000001855dfaa480bdc0e359e52ba1b470b7ef2d0fab6c7b7e2f220b582dbe04360c2601000000be473044022001b1cd154552a6bb153aac12f2f9d8d78d18e027e9cb5259d868b0a5d55853cd02200c29973c19fe13745cf42d532bdd3b10f4721489e6d6a0445d1cef59e7d5b13f01004c73635221033b29afadb7f4ef05659d5a2862af44cbe713490c28ae1bd704f02446490a19fa21021c308b874b69df67ef67795243ee81cbbe7c32e22d92e5127c253504599138ba52ae6703c09009b17521033b29afadb7f4ef05659d5a2862af44cbe713490c28ae1bd704f02446490a19faac680000000001905f0100000000001976a9144eb9ea59ef457ee87b3a73f2dfec47faac36eb7688acc0900900')

var scriptSig = tx.inputs[0].script
console.log(scriptSig)

var flags = Interpreter.SCRIPT_VERIFY_P2SH
| Interpreter.SCRIPT_VERIFY_STRICTENC
| Interpreter.SCRIPT_VERIFY_SIGPUSHONLY
| Interpreter.SCRIPT_VERIFY_NULLDUMMY
// | Interpreter.SCRIPT_VERIFY_DERSIG
// | Interpreter.SCRIPT_VERIFY_LOW_S
| Interpreter.SCRIPT_VERIFY_MINIMALDATA
| Interpreter.SCRIPT_VERIFY_CHECKLOCKTIMEVERIFY

var verified = interpreter.verify(scriptSig, scriptPubkey, tx, 0, flags);

console.log(verified, interpreter)
