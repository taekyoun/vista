
public class Sort {
    /**
     * @title 버블정령
     * @comment 인접한 두 원소를 비교하여 순서가 맞지 않으면 교환하는 방식
     * @시간복잡도 n^2
     * @장점 구현이 간단하다
     * @단점 비효율적이고, 큰 데이터에는 부적합하다
     */
    public void bubble(int[] arr){
        int n = arr.length;
        for(int i=0; i<n-1; i++ ){
            for(int j = 0; j< n-i-1; j++){
                if(arr[j]>arr[j+1]){
                    int temp = arr[j];
                    arr[j] = arr[j+1];
                    arr[j+1] = temp;
                }
            }
        }
    }
    /**
     * @title 선택정령
     * @comment 배열에서 가장 큰(작은) 원소를 찾아 맨 앞의 원소와 교환하는 방식
     * @시간복잡도 n^2
     * @장점 구현이 간단하다
     * @단점 비효율적이고, 큰 데이터에는 부적합하다
     */
    public void selection(int[] arr){
        int n = arr.length;
        for(int i=0; i<n-1; i++ ){
            int maxIndex = i;
            for(int j =i+1; j<n; j++){
                if(arr[maxIndex] <arr[j]){
                    maxIndex=j;
                }
            }
            int temp = arr[i];
            arr[i] = arr[maxIndex];
            arr[maxIndex] = temp;
        }
    }

    /**
     * @title 삽입
     * @comment 정렬된 부분과 정렬되지 않은 부분은 나누어, 정렬되지 않은 부분의 원소를 하나씩 꺼내어 정렬부분의 삽입하는 방식
     * @시간복잡도 n^2
     * @장점 부분적 정령된 데이터에 효율적
     * @단점 큰 데이터에는 비효율적이다
     */
    public void insertion(int[] arr){
        int n = arr.length;
        for(int i=0; i<n; i++ ){
            int key = arr[i];
            int j= i-1;
            while ( j>=0 && arr[j]>key){
                arr[j+1] = arr[j];
                j--;
            }
            arr[j+1] = key;
      
        }
    }
}
