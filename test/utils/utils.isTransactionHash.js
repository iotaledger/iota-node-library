var chai = require('chai')
var assert = chai.assert
var Utils = require('../../lib/utils/utils.js')
var isTransactionHash = Utils.isTransactionHash
var transactionObject = Utils.transactionObject

describe('utils.isTransactionHash', function () {
  var transaction = transactionObject('U9GQBLSLSHTGIIDWWANRFHAWGNOVHOSAWLXNBPOJVPSTQRBYILRDNSGRMIBUMNSATRSMPWGMPNVBSVFIBMEVYTPJDKLPRNPWQTUBGF9WENRKVTRMILEOEOSMU9KIBEEFQJNKYRNBGCCHIIOXGCTSSEV9AIYNMPBPQAWYAKUFKHSEBHPMWQZXD9ARRGTABMHCFJPNKUWHCYHFRPZTXZZTATKAYHXHNX9QKQXYBZSIZJLHAJRTJZDPTQYTCPHIZIQN9SIOFNQUCMD9MOLYONGALHDLNAITVZJAMTBDYWUS9HRGYZKGTEMTCGWHUMNIZJOUMLDXLWHBUFHQOZJDC9EMYULMLOCBPUSIL9JMLXVIEEVYOWUF9JZYEHAVPMW9TQINYJUFIRNKDUUSFHP9VIVRXTUHNNERZBLJDQXHCILJPUXIQMIMDGFWNMTSOUGKLYR9VVAHQ9HEU9KZYROHRLVLIRTGKRSYPMAEZRXIIZSZFORDLLUNWZTLYKDCJAXGJXTSYHMLEJJLSKSLKCHJWHOFFY9N9NMHN9CXLPLVPNZODSVEHVVHHXBQPKAHPSKKMZHKMAGDDJNRMQWETZREXYRCOXWLZXDZFOPV9UQFQRCDFTLDRAFNOTOLNWKOWXQQDRCGFLSZROMYBFQMXHZCLLAEIRFZXOZXWJQXBZQTI9QRQCNRQKEAWUPZWT9VERT99XPSZSEMMXMWMMLDRGOBXVXAXTK9BCYKGHWEHXOCUAZNIYTGWXMGLNWOKTKRZHFAYTWT9A9KPTKDDEUCLDNRKXOTL9MNJAR9TOENSJWRWQDPTX9XJRMNCXDINMWGWQZJVPBTZZIOMIPLMXOBBKMQGGEXQFEABUAFNPIWTCEFAOHVQWXEHYBD9BLNONFLZDDDQVVJ9AAZKLVROWWJEVEVZOUNXNPUUNYWWGERBWCMLRUNITOTGSBDVBAFFOZQKRSRAWEUNWACFSRWFDYAHSYHU9ILSWTSOHMYHSWPTJLAPOQDJHSBIMLBGGWFBBRTOWKTTDQEXBV9IVVZPFJKHYWWBGIMNZVMUAEZADZSQJVOMBSJIPBHYUFFVEOPOOSHPAOVNFBLCV9GTHJCHJQTODOIRVQXMPDCVEPHJQDIVAKFEXZIZJFBPXEKKZFOIBGJETGLQUPVFS9BPYGLVNJVCLSEOLVDCPNIUTMYIL9HOSPPUJKADRFQYDOUMVJAPK9LIESRGJAMTDSLQTZBNMZEYPOFRLODFKOLDHDMBUQRNKEIDPDUFVHAXL9EAKL9GWZBQHE9TPJOWNUVTGCFXY9CCXKALAEKJUY9GDCTABQRKIMJVQI9DQTYMQHU9QGFOFTBUOOYYIHEJXBMDWBSHVBD9P9SFAEGO9VLRROKRDCLXCPFMEJJLTWP9EZSTFALYEORFIGLNNYELMQNRGWEGIDWEXUVSWEZ99X9BRDCBWNBKBIHZTMVXMC9XJQTUCMBEJBGWJVRPXRIJSMCMWMZHGPRXJWEXPEKLBJEIELBUGJUMFEGITVRGCELLZMSW9HTDQINUIDZXF9F9PXSFTTOQXBWUEDAADVOG9EBZP9K9YR9YDDMQWIHEYAS9YBORRYSFSGNLCZSXONBQFTQXFWST9NWMRHORJJXNZLNMOJUQBYKVPAWUBZNLPDCFYFDFOERAPQUWTSUHHONLRLSEMPKDXFKVPAJXY99SRBRXCQJNCGSIULSDADBUVCOKT9UFFPJCXULUROLPNBRIIEOCWQN9YUPTANIDNOCAJGCFTBJBZWQIGVGWTDZTDZUCOYKXOFXFCQHHWHXCDLXRBQGFFJBVOXJVX9JJAOMBQYKCHXRFRUXIVJVRIAJVYQLIQJPMPMNLCRS9ZZAYKTFKEPJJECTMRVXLGJTWXLZBFYOOPYCZIUWYQERLGHYHNJS9UGABLUIRHLAV9KQWU9HJXKTHURDDZOCECNRAMLSSTLCHOQKTXPAJGNACFQZ9QNMTOFHFOSIBABBIBHYKMEDFAXDDDKFEGHCDVIBKOTBZEEEPYIJBUKEZBC9PSOTYVXKJMURDVAXATMWYLYECURREYBRXWWIFZJTIKSOYVUKFEGNJZSPSUEYVCUQADUNZZANBITAQCCTRDKIDZQJYFKVIFHFZOJDFABTDGMITXQKLWAFJNPZQCZCBBEOMDX9JJSDYXJKWKXPBFHSMCUQUCNIEKHUU9PKUJDRPWVLDZLZMBWYVAGJALLJEJVXUJIPITTHLEVW9EPOXYGRVCF9GRMSBTAUFGLXZCBFRMPQUK9JLVJNLVBW999999999999999999999999999TRINITY99999999999999999999PFVOGYD99B99999999C99999999ETSWPNLGYCNUGIYRCHUBBJQKGZ9NDHNPJKZLWDURHNBVHUKLKLDCBBLBQBWVBKLWOKFRTXUXIBPFWLKJW999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999TRINITY99999999999999999999999999999999999999999999999999999999999999999999999999')

  var hash = 'CTED9CPXJDIHWRCQZATCNFIPHKZHQTKWJP9PTR9QYVQVJFRQXGFSGCQJDLAVI9CYHBLMNXOSOAYBUWTCZ'
  var invalidHash = 'CTED999999'

  var minWeightMagnitude = 2

  it('should return true if transaction.hash is valid and minWeightMagnitude <= weightMagnitude', function () {
    assert.strictEqual(isTransactionHash(transaction, minWeightMagnitude), true)
  })

  it('should return true if hash is valid and minWeightMagnitude <= weightMagnitude', function () {
    assert.strictEqual(isTransactionHash(hash, minWeightMagnitude), true)
  })

  it('should return false if hash is invalid', function () {
    assert.strictEqual(isTransactionHash(invalidHash), false)
  })

  it('should return false if hash is invalid and minWeightMagnitude <= weightMagnitude', function () {
    assert.strictEqual(isTransactionHash(invalidHash, minWeightMagnitude), false)
  })

  it('should return false if minWeightMagnitude > weightMagnitude', function () {
    assert.strictEqual(isTransactionHash(hash, minWeightMagnitude + 1), false)
  })
})