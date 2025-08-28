import { Program } from "@project-serum/anchor";
import { Keypair, PublicKey, SystemProgram } from "@solana/web3.js";
import { Observable, Subscriber } from "rxjs";
import { snippets } from "../../../../_helpers";
import sha256 from 'crypto-js/sha256';
import hmacSHA512 from 'crypto-js/hmac-sha512';
import Base64 from 'crypto-js/enc-base64';
export const OTCTradesSolanaFunctions:any = {
    initOTCTrades: async (program:any, blogKey:any, walletKey:any, setBlogKey:any)=>{
        try {
            const blog = await program.account.blogState.fetch(blogKey);
            console.log(blog);
            return blog;
          } catch {
            const blogAccount = Keypair.generate();
            const genesisPostAccount = Keypair.generate();
            await program.rpc.initBlog({
              accounts: {
                authority: walletKey,
                systemProgram: SystemProgram.programId,
                blogAccount: blogAccount.publicKey,
                genesisPostAccount: genesisPostAccount.publicKey,
              },
              signers: [blogAccount, genesisPostAccount],
            });
            const blog = await program.account.blogState.fetch(blogAccount.publicKey);
            let key = new PublicKey(blogAccount.publicKey.toString());
            localStorage.setItem("publicKey", key.toBase58());
            setBlogKey(new PublicKey(blogAccount.publicKey.toString()));
            return blog;
          }
    },
    getUserAccount: async (program:any, walletKey:any)=>{
        const userAccount:any = {};  //getUserKey(walletKey);
        try {
          const _user = await program.account.userState.fetch(
            userAccount.publicKey
          );
      
          const user = {
            id: userAccount.publicKey.toString(),
            name: _user.name,
            avatar: _user.avatar,
          };
      
          return user;
        } catch {}
    },
    createTransaction: async ()=>{

    },
    getTransaction: async (postId:any, program:any)=>{
        try {
            const post = await program.account.postAccount.fetch(new PublicKey(postId));
            const userId = post.user.toString();
            if (userId === SystemProgram.programId.toString()) {
              return;
            }
            return {
              id: postId,
              title: post.title,
              content: post.content,
              userId,
            };
          } catch (e) {
            console.log(e.message);
          }
    },
    getUserTransactions: async (args:any)=>{
        let sub;

        const cancel = () => sub?.unsubscribe();
        const observer = new Observable((subscriber) => {
          sub = subscriber;
      
          async function start() {
            const { program, fromPostId } = args;
            let nextPostId= fromPostId;
      
            while (!!nextPostId) {
              const post = await getPostById(nextPostId, program);
              if (!post) {
                break;
              }
      
              subscriber.next(post);
              nextPostId = post.prePostId;
            }
      
            subscriber.complete();
          }
      
          start();
        });
      
        return [observer, cancel] ;
    },
    getAllTransactions: async ()=>{

    },
    updateTransaction: async ()=>{

    },
    patchTransaction: async ()=>{

    },
    deleteTransaction: async ()=>{

    },
    generateTransactionSignature: (sender:string, receiver:string, amount:number, title:string, description:string)=>{
      const hashDigest = sha256(sender);
      const hmacDigest = Base64.stringify(snippets.cryptography.HmacSHA512(`${hashDigest}:${sender}:${receiver}:${amount}:${title}?:${description}`));
      return hmacDigest;
    },
    generateWalletHash: (publicKey:number)=>{
      const hashDigest = sha256(publicKey);
      const hmacDigest = Base64.stringify(sha512(publicKey+hashDigest));
      return hmacDigest;
    },
}