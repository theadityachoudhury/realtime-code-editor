export const otpgen = (length: number): string => {
    const alphabets: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const digits: string = '0123456789';
    let otp: string = '';
  
    let alphabetCount: number = 0;
    let hasMinimumOneAlphabet: boolean = false;
  
    for (let i: number = 0; i < length; i++) {
      let randomIndex: number;
  
      if (
        (alphabetCount < 2 && Math.random() < 0.5) ||
        (i === length - 1 && !hasMinimumOneAlphabet)
      ) {
        randomIndex = Math.floor(Math.random() * alphabets.length);
        otp += alphabets[randomIndex];
        alphabetCount++;
        hasMinimumOneAlphabet = true;
      } else {
        randomIndex = Math.floor(Math.random() * digits.length);
        otp += digits[randomIndex];
      }
    }
  
    return otp;
  };