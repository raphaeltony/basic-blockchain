/* 
    A simple program to understand blockchain 
*/

const SHA256 = require('crypto-js/sha256'); // An external encryption library

// The class for each block of the blockchain
class Block{
    constructor(index,timestamp,data,previousHash=''){
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calcHash();
        this.nonce = 0; //A nonce value is a random value which is used to mine a block.It keeps increasing in a loop.
    }
    //Calculates the hash value of the block
    calcHash(){
        return SHA256(this.index + this.previousHash + this.timestamp + this.nonce + JSON.stringify(this.data)).toString();
    }

    /*
    This function uses the computational power of your PC to mine the correct hash (With correct no. of zeroes). Only then the block will
    be added to the chain. The difficulty is actually the number of zeroes that should be present in front of the hash. The nonce value is
    the variable that keeps increasing and in turn it will change the hash each time the loop is run.(Since nonce is used in calcHash() )
    When you add this number to the hashing process, it will give you the hash with the right amount of 0s.   
    */
    mineBlock(difficulty){
        while(this.hash.substring(0,difficulty) !== Array(difficulty+1).join("0")){
            this.nonce++;
            this.hash = this.calcHash(); //Recalculate hash since nonce has changed
        }
        console.log("Block mined :" + this.hash);
    }
}

//The class that defines the blockchain. Only one instance will be made
class Blockchain{
    constructor(){
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 4; //The difficulty of mining the block (no. of zeroes)
    }

    createGenesisBlock(){
        return new Block(0,"29/4/2018","Genesis Block","0000"); //The first block of the block chain is called as the genesis block
    }

    getLatestBlock(){
        return this.chain[this.chain.length-1];
    }

    //Adding a new block to the chain :
    addBlock(newBlock){
        newBlock.previousHash = this.getLatestBlock().hash; 
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);  //Adding the block to the chain (array);
    }

    //Making sure thaat the chain has not been tampered with:
    checkChainValidity(){
        for(let i=1; i<this.chain.length; ++i){
            //Check if the hash it stores is the calculated hash
            if(this.chain[i].hash !== this.chain[i].calcHash()){
                return false;
            }
            //Check if the 'previousHash' stored in current block points to the hash stored in previous block
            if(this.chain[i].previousHash !== this.chain[i-1].hash){
                return false;
            }
                
        }
        return true;
    }
}

//Here we are going to use the block chain for some purpose. For eg : cryptocurrency
let Raphcoin = new Blockchain;
console.log("Mining block 1 : ");
Raphcoin.addBlock(new Block(1,"30/4/2018",{info : "Added a new block", amount : 32}));
console.log("Mining block 2 : ");
Raphcoin.addBlock(new Block(2,"30/4/2018",{info : "Added a new block", amount : 66}));
console.log("Mining block 3 : ");
Raphcoin.addBlock(new Block(3,"30/4/2018",{info : "Added a new block", amount : 456}));

//Printing out the block chain:
console.log(JSON.stringify(Raphcoin,null,4));
console.log("Is blockchain valid :" + Raphcoin.checkChainValidity());

//Changing data in the blockchain (Just for demo):
Raphcoin.chain[2].data = {amount : 100};
console.log("Is blockchain valid :" + Raphcoin.checkChainValidity());
